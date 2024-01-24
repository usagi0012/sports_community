// const server = "http://localhost:8001";

async function getClub() {
    const response = await axios.get("/api/club", {});
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

    response.data.forEach((club) => {
        console.log("클럽", club);
        console.log("클럽아이디",club.id)
        const clubListDiv = document.querySelector(".club-list");
        console.log(clubListDiv);

        const clubInfoDiv = document.createElement("div");
        clubInfoDiv.className = "clubInfo";

        const clubName = document.createElement("div");
        clubName.className = "clubName";
        // 이름에 click버튼 달고, click하면 동아리 상세 페이지로 이동
        clubName.innerHTML += `<p onclick="moveToClubDetail(${club.id})">${club.name}</p>`;
        // 1. onclick
        // 2. axios 이용해서 함수 만들기.
        // window onload
        clubInfoDiv.appendChild(clubName);

        const clubRegion = document.createElement("div");
        clubRegion.className = "clubRegion";
        clubRegion.innerHTML = `${region[club.region]}`;
        clubInfoDiv.appendChild(clubRegion);

        clubListDiv.appendChild(clubInfoDiv);
    });
    console.log(response);
}
getClub();

async function moveToClubDetail(clubId) {
    console.log("here")
    window.location.href =
        `http://localhost:8001/club-detail.html?clubId=${clubId}`;
    getClubDetail(clubId);
}
