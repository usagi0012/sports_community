window.onload = function () {
    loadHeader();

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

export default function getClubDetail(clubId) {
    const token = localStorage.getItem("accessToken");
    axios
        .get(`/api/club/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
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
            const clubMasterDetail = document.createElement("div");
            clubMasterDetail.className = "clubMasterDetail";
            clubMasterDetail.innerHTML = `${response.data.users[0].name}`;
            // 클릭 이벤트 리스너 등록
            clubMasterDetail.addEventListener("click", function () {
                createModal(response.data.users[0].id);
            });
            clubMasterDiv.appendChild(clubMasterDetail);

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

function getMyClubId() {
    const token = localStorage.getItem("accessToken");
    axios
        .get("api/club/myClubId", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            getClubDetail(response.data);

            hasClub();
            axios
                .get(`/api/club/myClub/${response.data}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        const updateBtn = document.querySelector(".updateBtn");
                        updateBtn.style.display = "block";
                        const deleteBtn = document.querySelector(".deleteBtn");
                        deleteBtn.style.display = "block";
                        const expelMemberBtn =
                            document.querySelector(".expelMemberBtn");
                        expelMemberBtn.style.display = "block";
                        const myClubApplication =
                            document.querySelector(".myClubApplication");
                        myClubApplication.style.display = "block";
                        const matchManagement =
                            document.querySelector(".matchManagement");
                        matchManagement.style.display = "block";
                    } else {
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        });
}
getMyClubId();

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
            if (response.data.statusCode === 200) {
                const updateBtn = document.querySelector(".updateBtn");
                updateBtn.style.display = "block";
                const deleteBtn = document.querySelector(".deleteBtn");
                deleteBtn.style.display = "block";
                const expelMemberBtn =
                    document.querySelector(".expelMemberBtn");
                expelMemberBtn.style.display = "block";
            } else {
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

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
