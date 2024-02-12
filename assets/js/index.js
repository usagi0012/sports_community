// cookie에 있는 token 값을 local로 이동하는 로직
window.onload = function () {
    const cookieaccess = getCookie("accessToken");
    const cookierefresh = getCookie("refreshToken");

    if (cookieaccess && cookierefresh) {
        localStorage.setItem("accessToken", cookieaccess);
        localStorage.setItem("refreshToken", cookierefresh);

        // localStorage.setItem("accessToken");
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
                console.log(response.data.data.userProfile);
                const user = response.data.data.userProfile;
                //프로필 이미지
                //성별
                profile = `
                <div class="image">
                    <img src="${user.image}" id="profileImage" />
                </div>
                <div class="nickname">${user.nickname}</div>
                <div class="gender">
                </div>
                <div class="tag">
                    <span id="tag1"> #커리 </span>
                    <span id="tag2"> #조던 </span>
                    <span id="tag3"> #지각 </span>
                </div>
                <div class="height">키: ${user.height}</div>
                <div class="description">${user.description}</div>
                <div class="scoreContainer">
                    <div class="score" id="personalityAmount">
                        인성: <i class="fas fa-solid fa-star"></i> 4.2
                    </div>
                    <div class="score" id="abilityAmount">
                        실력: <i class="fas fa-solid fa-star"></i> 4.6
                    </div>
                    <div class="score" id="MVPCount">MVP: 10 회</div>
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

function getPersonalRank() {
    axios
        .get("/api/updated-rank/personal")
        .then(function (response) {
            console.log("===개인 랭크===", response);
            const personalityRankInnerContainner = document.querySelector(
                ".personalityRankInnerContainer",
            );
            const abilityRankInnerContainner = document.querySelector(
                ".abilityRankInnerContainer",
            );

            // 인성 div 만들기
            const personality = response.data.filter(
                (score) => score.isPersonality,
            );
            console.log("===인성값만 뽑은 결과===", personality);

            const orderedPersonality = personality.sort(
                (a, b) => b.personalityScore - a.personalityScore,
            );
            console.log("===인성 정렬===", orderedPersonality);

            orderedPersonality.forEach((personalityRank) => {
                const rankCard = document.createElement("div");
                rankCard.className = "rankCard";
                const rankNickName = document.createElement("div");
                rankNickName.className = "rankNickName";
                rankNickName.innerHTML = `${personalityRank.nickname}`;
                rankCard.appendChild(rankNickName);

                const rankScore = document.createElement("div");
                rankScore.className = "rankScore";
                rankScore.innerHTML = `<i class="fas fa-solid fa-star"></i>${personalityRank.personalityScore}`;
                rankCard.appendChild(rankScore);

                personalityRankInnerContainner.appendChild(rankCard);
            });

            // 실력 div 만들기
            const ability = response.data.filter((score) => score.isAbility);
            console.log("===실력값만 뽑은 결과===", personality);

            const orderedAbility = ability.sort(
                (a, b) => b.abilityScore - a.abilityScore,
            );
            console.log("===실력 정렬===", orderedAbility);

            orderedAbility.forEach((abilityRank) => {
                const rankCard = document.createElement("div");
                rankCard.className = "rankCard";
                const rankNickName = document.createElement("div");
                rankNickName.className = "rankNickName";
                rankNickName.innerHTML = `${abilityRank.nickname}`;
                rankCard.appendChild(rankNickName);

                const rankScore = document.createElement("div");
                rankScore.className = "rankScore";
                rankScore.innerHTML = `<i class="fas fa-solid fa-star"></i>${abilityRank.abilityScore}`;
                rankCard.appendChild(rankScore);

                abilityRankInnerContainner.appendChild(rankCard);
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
            console.log("===클럽 랭크===", response);
            const clubRankInnerContainner = document.querySelector(
                ".clubRankInnerContainer",
            );

            // 클럽 div 만들기
            const orderedClubRank = response.data.sort(
                (a, b) => b.totalScore - a.totalScore,
            );
            console.log("===클럽 정렬===", orderedClubRank);

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

                clubRankInnerContainner.appendChild(rankCard);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}
