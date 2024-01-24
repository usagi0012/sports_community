// const server = "http://localhost:8001";
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
    getClub();
};

function getClub() {
    axios
        .get("/api/club")
        .then(function (response) {
            console.log(response);
            response.data.forEach((club) => {
                console.log("club", club);
                const clubListDiv = document.querySelector(".club-list");

                const clubInfoDiv = document.createElement("div");
                clubInfoDiv.className = "clubInfo";

                const clubId = document.createElement("div");
                clubId.className = "clubId";
                clubId.innerHTML = `${club.id}`;
                clubInfoDiv.appendChild(clubId);

                const clubName = document.createElement("div");
                clubName.className = "clubName";
                clubName.innerHTML += `<p onclick="moveToClubDetail(${club.id})">${club.name}</p>`;
                // 2. axios 이용해서 함수 만들기.
                clubInfoDiv.appendChild(clubName);

                const clubRegion = document.createElement("div");
                clubRegion.className = "clubRegion";
                clubRegion.innerHTML = `${region[club.region]}`;
                clubInfoDiv.appendChild(clubRegion);

                // 백엔드에서 클럽id에 해당하는 이름 보내줘야 할 듯.
                const clubMaster = document.createElement("div");
                clubMaster.className = "clubMaster";
                clubMaster.innerHTML = `${club.masterId}`;
                clubInfoDiv.appendChild(clubMaster);

                const clubScore = document.createElement("div");
                clubScore.className = "clubScore";
                clubScore.innerHTML = `${club.score}`;
                clubInfoDiv.appendChild(clubScore);

                clubListDiv.appendChild(clubInfoDiv);
            });
        })
        .catch(function (error) {
            console.log(error.request.response);
            alert(error.request.response);
        });
}

function moveToClubDetail(clubId) {
    console.log("here");
    console.log("clubId", clubId);
    window.location.href = `http://localhost:8001/club-detail.html?clubId=${clubId}`;
    getClubDetail(clubId);
    console.log("$$$$$");
}
