window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    let clubId = urlParams.get("id");
    loadHeader();
    getClubDetail(clubId);
    hasClub();
    isClubMaster();
    isMyClub();
    getMember(clubId);
    loadFooter();
};
const regionData = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충청북도",
    "충청남도",
    "경상북도",
    "경상남도",
    "전라북도",
    "전라남도",
    "제주도",
];

function getClubDetail(clubId) {
    const token = localStorage.getItem("accessToken");
    axios
        .get(`/api/club/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log("response", response);

            const clubNameDiv = document.querySelector(".name");
            const clubNameDetail = document.createElement("div");
            clubNameDetail.className = "clubNameDetail";
            clubNameDetail.innerHTML += `${response.data.name}`;
            clubNameDiv.appendChild(clubNameDetail);

            const regionDiv = document.querySelector(".region");
            const region = document.createElement("div");
            region.className = "regionDetail";

            region.innerHTML += `${regionData[response.data.region]}`;

            regionDiv.appendChild(region);

            const scoreDiv = document.querySelector(".score");
            const score = document.createElement("div");
            score.className = "scoreDetail";
            score.innerHTML += `${response.data.score}`;
            scoreDiv.appendChild(score);

            const memberDiv = document.querySelector(".member");
            const member = document.createElement("div");
            member.className = "memberDetail";
            member.innerHTML += `${response.data.members}`;
            memberDiv.appendChild(member);

            const createdAtDiv = document.querySelector(".createdAt");
            const createdAt = document.createElement("div");
            createdAt.className = "createdAtDetail";
            const date = response.data.createdAt.slice(0, 10);
            createdAt.innerHTML += `${date}`;
            createdAtDiv.appendChild(createdAt);

            const clubMasterDiv = document.querySelector(".clubMaster");
            const clubMaster = document.createElement("div");
            clubMaster.className = "clubMasterDetail";
            clubMaster.innerHTML += `${response.data.users[0].name}`;
            // 클릭 이벤트 추가
            clubMaster.addEventListener("click", function () {
                createModal(response.data.users[0].id);
            });

            clubMasterDiv.appendChild(clubMaster);

            const detailsDiv = document.querySelector(".details");

            const image = document.createElement("div");
            image.className = "imageDetail";
            if (response.data.image) {
                const imageElement = document.createElement("img");
                imageElement.src = response.data.image;
                imageElement.alt = "Uploaded Image";
                image.appendChild(imageElement);
                detailsDiv.appendChild(image);
            }

            const details = document.createElement("div");
            details.className = "detailsDetail";
            details.innerHTML += `${response.data.description}`;
            detailsDiv.appendChild(details);
        })
        .catch(function (error) {
            console.log("error response", error.response);
            // alert(error.request.response);
        });
}

function isClubMaster() {
    const token = localStorage.getItem("accessToken");

    axios
        .get(`/api/club/clubMaster`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log("dsfdf", response);
            console.log(response.data.statusCode);
            if (response.data.statusCode === 200) {
                const applyingClubMatch =
                    document.querySelector(".applyingClubMatch");
                applyingClubMatch.style.display = "block";
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function isMyClub() {
    const urlParams = new URLSearchParams(window.location.search);

    let clubId = urlParams.get("id");
    const token = localStorage.getItem("accessToken");

    axios
        .get(`/api/club/myClub/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log("dsfdf", response);
            console.log(response.data.statusCode);
            if (response.data.statusCode === 200) {
                const updateBtn = document.querySelector(".updateBtn");
                updateBtn.style.display = "block";
                const deleteBtn = document.querySelector(".deleteBtn");
                deleteBtn.style.display = "block";
                const toMyClubBtn = document.querySelector(".toMyClubBtn");
                toMyClubBtn.style.display = "block";
                const matchBtn = document.querySelector(".matchBtn");
                matchBtn.style.display = "none";
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function hasClub() {
    const token = localStorage.getItem("accessToken");
    console.log("token", token);
    axios
        .get("/api/club/myClub", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            if (response.data.data === true) {
                const applyingBtn = document.querySelector(".applyingBtn");
                applyingBtn.style.display = "block";
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.message);
            console.log("에러메세지");
        });
}

async function getMember(clubId) {
    const token = localStorage.getItem("accessToken");

    try {
        const clubMember = await axios.get(`/api/club/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userIds = clubMember.data.users.map((user) => user.id);

        const membersResponse = await axios.get(`/api/club/member/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("멤버", membersResponse);
        membersResponse.data.forEach((info, index) => {
            console.log("==info==", info);
            if (info.nickname) {
                const memberListDiv = document.querySelector(".memberList");
                const nickNameDiv = document.createElement("div");
                nickNameDiv.addEventListener("click", () => {
                    // 클릭된 닉네임의 ID만을 전달하되, 배열로 전달
                    createModal([userIds[index]]);
                });
                nickNameDiv.className = "nickName";
                nickNameDiv.innerHTML = `${info.nickname}`;
                memberListDiv.appendChild(nickNameDiv);
            } else {
                const memberListDiv = document.querySelector(".memberList");
                const nickNameDiv = document.createElement("div");
                nickNameDiv.addEventListener("click", () => {
                    // 클릭된 닉네임의 ID만을 전달하되, 배열로 전달
                    createModal([userIds[index]]);
                });
                nickNameDiv.className = "name";
                nickNameDiv.innerHTML = `${info.userName}`;
                memberListDiv.appendChild(nickNameDiv);
            }
        });
    } catch (error) {
        console.log(error);
    }
}
