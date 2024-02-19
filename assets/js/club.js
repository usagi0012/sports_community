const region = [
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

window.onload = function () {
    console.log("start");
    loadHeader();
    getClub();
    hasClub();
    loadFooter();
};

function getClub(sortBy) {
    axios
        .get(`/api/club?sortBy=${sortBy}`)
        .then(function (response) {
            console.log("*******", response);
            response.data.data.forEach((club) => {
                const clubListDiv = document.querySelector(".club-list");

                const clubInfoDiv = document.createElement("div");
                clubInfoDiv.className = "clubInfo";

                const clubId = document.createElement("div");
                clubId.className = "clubId";
                clubId.innerHTML = `${club.id}`;
                clubInfoDiv.appendChild(clubId);

                const clubName = document.createElement("div");
                clubName.className = "clubName";
                const clubNameP = document.createElement("p");
                clubNameP.textContent = club.name;
                clubNameP.onclick = function () {
                    // 페이지 이동 전에 로그인 된 유저만 이동될 수 있도록 막음.

                    const token = localStorage.getItem("accessToken");
                    axios
                        .get(`/api/club/${club.id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .then(function (response) {
                            console.log("response", response);
                            window.location.href = `club-detail.html?id=${club.id}`;
                        })
                        .catch(function (error) {
                            console.log(error.response);
                            console.log("error", error);
                            console.log(
                                "error.message",
                                error.response.data.message,
                            );
                            if (
                                error.response.data.message === "Unauthorized"
                            ) {
                                alert("로그인이 필요합니다.");
                            }
                            if (
                                error.response.data.message ===
                                "accessToken expired"
                            ) {
                                alert("다시 로그인 해주세요.");
                            }

                            return;
                        });

                    // getClubDetail(club.id);
                };
                clubName.appendChild(clubNameP);
                clubInfoDiv.appendChild(clubName);

                const clubRegion = document.createElement("div");
                clubRegion.className = "clubRegion";
                clubRegion.innerHTML = `${region[club.region]}`;
                clubInfoDiv.appendChild(clubRegion);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 동아리장일 경우에만 "내 동아리 신청서 조회" 버튼 display="block"
function isClubMaster() {
    const token = localStorage.getItem("accessToken");
    axios
        .get("/api/applying-club/clubMaster", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log("여기 response", response);
            console.log("들어온거 맞아?");
            if (response.data.statusCode !== 400) {
                console.log("여기까지?");
                const myClubApplicationBtn =
                    document.querySelector(".myClubApplication");
                myClubApplicationBtn.style.display = "block";
            }
        })
        .catch(function (error) {
            console.log("여기");
            console.log(error);
        });
}

isClubMaster();

function hasClub() {
    const token = localStorage.getItem("accessToken");
    axios
        .get("/api/club/myClub", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            if (response.data.data === true) {
                const createBtn = document.querySelector(".createBtn");
                createBtn.style.display = "block";
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.message);
            console.log("에러메세지");
        });
}
