// cookie에 있는 token 값을 local로 이동하는 로직
window.onload = function () {
    const cookieaccess = getCookie("accessToken");
    const cookierefresh = getCookie("refreshToken");

    if (cookieaccess && cookierefresh) {
        localStorage.setItem("accessToken", cookieaccess);
        localStorage.setItem("refreshToken", cookierefresh);

        document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
            "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
        getProfile("home");
    } else {
        getProfile("login");
    }
    getPersonalRank();
    getClubRank();
    loadHeader();
    loadFooter();
    getFAQ();
    getNotice();
};

// 각 cookie에 대한 토큰값
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

//프로필 불러오기
const profileContainer = document.getElementById("profileContainer");

function getProfile(token) {
    let profile = "";
    if (token === "home") {
        profileContainer.remove();
    } else if (token === "login") {
        const accessToken = localStorage.getItem("accessToken");
        axios
            .get("/api/user/me/profile", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(function (response) {
                const user = response.data.data.userProfile;
                //프로필 이미지
                //성별
                profile = `
                <div class="image">
                    <img src="${user.image}" id="profileImage" />
                </div>
                <div class="nickname">${user.nickname}</div>
                <div class="gender" id="gender">
                </div>
                <div class="tag" id="tag1">
                    
                </div>
                <div class="height">키: ${user.height}</div>
                <div class="position" id="position"></div>
                <div class="description">${user.description}</div>
                <div class="scoreContainer">
                    <div class="score" id="personalityAmount">
                    </div>
                    <div class="score" id="abilityAmount">
                    </div>
                    <div class="score" id="MVPCount"></div>
                </div>
                <button type="button" id="alarmBtn">
                    <i class="fas fa-solid fa-bell" onclick="toAlarm()"></i>
                </button>
                <button type="button" id="profileUpdateBtn" onclick="toUpdateUserProfile()">
                    수정하기
                </button>
                <div class="calenderContainer">
                    <button type="button" id="calenderBtn" onclick="toCalender()">캘린더 →</button>
                </div>`;
                profileContainer.innerHTML = profile;
                getGender(user.gender);
                getPosition(accessToken);
                getScore(accessToken);
                getTag(accessToken);
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.data.message == "프로필 정보가 없습니다.") {
                    profileContainer.classList.remove("profileContainer");
                    profileContainer.classList.add("noProfileContainer");
                    profile = `
                    <div class="noprofile" onclick="toPostUserProfile()">
                    프로필을 작성해야 원활한 커뮤니티 활동이 가능합니다.  프로필 작성 →
                    </div>`;
                    profileContainer.innerHTML = profile;
                }
            });
    }
}

async function getGender(gender) {
    const genderContainer = document.getElementById("gender");
    if (gender == "male") {
        genderContainer.innerHTML = `
        <i
        class="fas fa-solid fa-mars"
        style="color: #0860a8"
        ></i>
        `;
    } else if (gender == "female") {
        genderContainer.innerHTML = `<i class="fas fa-solid fa-venus" style="color: #cc679f"></i>`;
    }
}

async function getPosition(accessToken) {
    const positionResponse = await axios.get("/api/user/me/position", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (positionResponse) console.log("포지션 정보 가져오기", positionResponse);
    const positions = positionResponse.data.data.findPositionByUserId;

    // positions 배열에서 true인 속성들을 필터링하여 추출
    const truePositions = positions.filter((position) => {
        return position.guard || position.forward || position.center;
    });

    if (truePositions[0] === undefined) {
        document.getElementById("position").innerText = "없음";
    } else {
        // truePositions에서 true인 속성들의 이름을 추출
        const trueProperties = truePositions.map((position) => {
            return Object.entries(position)
                .filter(([key, value]) => value === true)
                .map(([key, value]) => key);
        });
        const showPosition = trueProperties.flat().join(", ");

        if (positionResponse.data.statusCode === 200) {
            const position = positionResponse.data.data;
            document.getElementById("position").innerText =
                `선호 포지션 : ${showPosition}`;
        }
    }
}

async function getScore(accessToken) {
    try {
        const scoreResponse = await axios.get("api/assessment/personal", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (scoreResponse.data.message === "개인 점수가 조회되었습니다.") {
            // 평가 점수가 있는 경우
            const score = scoreResponse.data.data;
            document.getElementById("personalityAmount").innerHTML = `
                인성: <i class="fas fa-solid fa-star"></i> ${score.personality}`;
            document.getElementById("abilityAmount").innerHTML = `
                실력: <i class="fas fa-solid fa-star"></i> ${score.ability}`;
            document.getElementById("MVPCount").innerHTML = `
            MVP: ${score.mvp} 회 `;
            if (!score.mvp) {
                document.getElementById("MVPCount").innerHTML = `
                MVP: 없음 `;
            }
        } else {
            // 평가 점수가 없는 경우
            document.getElementById("personalityAmount").innerHTML =
                "아직 평가점수가 없습니다.";
        }
    } catch (error) {
        // 에러 핸들링
        console.log(error);
        document.getElementById("personalityAmount").innerHTML =
            "아직 평가점수가 없습니다.";

        // 서버가 404를 반환하는 경우에 대한 추가 처리
        if (error.response && error.response.status === 404) {
            document.getElementById("personalityAmount").innerHTML =
                "아직 평가점수가 없습니다.";
        } else {
            // 기타 에러 처리
            document.getElementById("score").innerHTML =
                "점수를 가져오는데 에러가 발생하였습니다.";
        }
    }
}

async function getTag(accessToken) {
    try {
        // 유저 태그 가져오기
        const tagResponse = await axios.get("/api/assessment/personal/tag", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (tagResponse.data.message === "개인 태그가 조회되었습니다.") {
            // 유저 태그가 있는 경우
            const tag = tagResponse.data.data;

            const tagsText = Object.keys(tag).join(", ");
            document.getElementById("tag1").innerText = tagsText;
        } else {
            // 유저 태그가 없는 경우
            document.getElementById("tag1").innerText = "태그: 없음";
        }
    } catch (error) {
        // 에러 핸들링
        document.getElementById("tag1").innerText = "태그: 없음";

        // 서버 응답이 404일 때
        if (error.response && error.response.status === 404) {
            document.getElementById("tag1").innerText = "태그: 없음";
        } else {
            // 기타 에러 처리
            document.getElementById("tag").innerText = "에러 발생";
        }
    }
}

function getPersonalRank() {
    axios
        .get("/api/updated-rank/personal")
        .then(function (response) {
            const personalityRankInnerContainner = document.querySelector(
                ".personalityRankInnerContainer",
            );
            const abilityRankInnerContainner = document.querySelector(
                ".abilityRankInnerContainer",
            );
            const personalityRightDiv =
                document.querySelector(".personalityRight");

            const abilityRightDiv = document.querySelector(".abilityRight");

            // 인성 div 만들기
            const personality = response.data.filter(
                (score) => score.isPersonality,
            );

            const orderedPersonality = personality.sort(
                (a, b) => b.personalityScore - a.personalityScore,
            );

            orderedPersonality.forEach((personalityRank, index) => {
                const rankCard = document.createElement("div");
                rankCard.className = "rankCard";

                const rankNumber = document.createElement("div");
                rankNumber.className = `rankNumber${index + 1}`;
                rankNumber.innerHTML = ``;
                rankCard.appendChild(rankNumber);

                const rankNickName = document.createElement("div");
                rankNickName.className = "rankNickName";
                rankNickName.innerHTML = `${personalityRank.nickname}`;
                rankCard.appendChild(rankNickName);

                const rankScore = document.createElement("div");
                rankScore.className = "rankScore";
                rankScore.innerHTML = `<i class="fas fa-solid fa-star"></i> ${personalityRank.personalityScore.slice(
                    0,
                    3,
                )}`;
                rankCard.appendChild(rankScore);

                const rankDiv = document.querySelector(".rank");
                personalityRightDiv.appendChild(rankCard);
            });

            // 실력 div 만들기
            const ability = response.data.filter((score) => score.isAbility);

            const orderedAbility = ability.sort(
                (a, b) => b.abilityScore - a.abilityScore,
            );

            orderedAbility.forEach((abilityRank) => {
                const rankCard = document.createElement("div");
                rankCard.className = "rankCard";
                const rankNickName = document.createElement("div");
                rankNickName.className = "rankNickName";
                rankNickName.innerHTML = `${abilityRank.nickname}`;
                rankCard.appendChild(rankNickName);

                const rankScore = document.createElement("div");
                rankScore.className = "rankScore";
                rankScore.innerHTML = `<i class="fas fa-solid fa-star"></i>${abilityRank.abilityScore.slice(
                    0,
                    3,
                )}`;
                rankCard.appendChild(rankScore);

                abilityRightDiv.appendChild(rankCard);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getClubRank() {
    axios
        .get("/api/updated-rank/club")
        .then(function (response) {
            const clubRankInnerContainner = document.querySelector(
                ".clubRankInnerContainer",
            );
            const clubLeftDiv = document.querySelector(".clubLeft");

            // 클럽 div 만들기
            const orderedClubRank = response.data.sort(
                (a, b) => b.totalScore - a.totalScore,
            );

            orderedClubRank.forEach((clubRank) => {
                const rankCard = document.createElement("div");
                rankCard.className = "rankCard";
                const rankNickName = document.createElement("div");
                rankNickName.className = "rankNickName";
                rankNickName.innerHTML = `${clubRank.clubId}`;
                rankCard.appendChild(rankNickName);

                const rankScore = document.createElement("div");
                rankScore.className = "rankScore";
                rankScore.innerHTML = `<i class="fas fa-solid fa-star"></i>${clubRank.personalityScore}`;
                rankCard.appendChild(rankScore);

                clubLeftDiv.appendChild(rankCard);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getNotice() {
    const accessToken = localStorage.getItem("accessToken");
    axios
        .get("/api/notices", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const noticeList = response.data.data;
            noticeList.slice(0, 3);
            console.log(noticeList);
            noticeList
                .forEach((notices, index) => {
                    let noticeData = document.getElementById(
                        `noticeData${index + 1}`,
                    );
                    noticeData.innerHTML = `
                            ${notices.title}
                        `;
                    noticeData.addEventListener("click", function () {
                        toNoticeData(notices.id);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
}

function getFAQ() {
    const token = localStorage.getItem("accessToken");
    axios
        .get("/api/faq", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            const faqList = response.data.data;
            faqList.slice(0, 3);
            console.log(faqList);
            faqList
                .forEach((faqs, index) => {
                    let faqData = document.getElementById(
                        `faqData${index + 1}`,
                    );
                    faqData.innerHTML = `
                            ${faqs.title}
                        `;
                    faqData.addEventListener("click", function () {
                        toFAQData(faqs.id);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
}

function toNoticeData(num) {
    window.location.href = `noticeDetail.html?id=${num}`;
}

function toFAQData(num) {
    window.location.href = `faqDetail.html?id=${num}`;
}
