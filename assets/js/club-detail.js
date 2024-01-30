window.onload = function () {
    console.log("$$-1");
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    let clubId = urlParams.get("id");

    console.log("여기 들어감?");
    console.log("$$$1");
    getClubDetail(clubId);
    console.log("$$$2");
    hasClub();
    console.log("$$$3");
    isMyClub();
    console.log("$$4");
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

export default function getClubDetail(clubId) {
    console.log("##########");
    console.log("2번 클럽 아이디", clubId);
    // 보내는 순서 알아보기(header, params)
    // const authorized = localStorage.getItem("authorized");
    // const token = JSON.parse(authorized).accessToken.value;
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
            region.className = "region";

            region.innerHTML += `${regionData[response.data.region]}`;

            regionDiv.appendChild(region);

            const scoreDiv = document.querySelector(".score");
            const score = document.createElement("div");
            score.className = "score";
            score.innerHTML += `${response.data.score}`;
            scoreDiv.appendChild(score);

            const memberDiv = document.querySelector(".member");
            const member = document.createElement("div");
            member.className = "member";
            member.innerHTML += `${response.data.members}`;
            memberDiv.appendChild(member);

            const createdAtDiv = document.querySelector(".createdAt");
            const createdAt = document.createElement("div");
            createdAt.className = "createdAt";
            const date = response.data.createdAt.slice(0, 10);
            createdAt.innerHTML += `${date}`;
            createdAtDiv.appendChild(createdAt);

            const clubMasterDiv = document.querySelector(".clubMaster");
            const clubMaster = document.createElement("div");
            clubMaster.className = "clubMaster";
            clubMaster.innerHTML += `${response.data.users[0].name}`;
            clubMasterDiv.appendChild(clubMaster);

            const detailsDiv = document.querySelector(".details");

            const image = document.createElement("div");
            image.className = "image";
            if (response.data.image) {
                const imageElement = document.createElement("img");
                imageElement.src = response.data.image;
                imageElement.alt = "Uploaded Image";
                image.appendChild(imageElement);
                detailsDiv.appendChild(image);
            }

            const details = document.createElement("div");
            details.className = "details";
            details.innerHTML += `${response.data.description}`;
            detailsDiv.appendChild(details);
        })
        .catch(function (error) {
            console.log("error response", error.response);
            // alert(error.request.response);
        });
}

function isMyClub() {
    const urlParams = new URLSearchParams(window.location.search);

    let clubId = urlParams.get("id");
    console.log("클럽 아이디", clubId);
    const token = localStorage.getItem("accessToken");

    axios
        .get(`/api/club/myClub/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log("리스폰스는 여기", response);
            console.log("리스폰스 데이터", response.data);
            if (response.data.statusCode === 200) {
                const updateBtn = document.querySelector(".updateBtn");
                updateBtn.style.display = "block";
                const deleteBtn = document.querySelector(".deleteBtn");
                deleteBtn.style.display = "block";
            } else {
                console.log("수정/삭제버튼 안나옴");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function hasClub() {
    const token = localStorage.getItem("accessToken");
    console.log("여기는 찍혀?");
    console.log("token", token);
    axios
        .get("/api/club/myClub", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log("콘솔안쪽");
            console.log("ㅋㅋㅋㅋㅋ리스폰스", response);
            console.log("ㅋㅋㅋㅋ리스폰스 데이터", response.data);
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
