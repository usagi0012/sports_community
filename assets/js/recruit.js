// import { createModal } from "./otherUser-modal.js";

window.onload = function () {
    loadHeader();
    feed();
    loadFooter();
};

let currentFilterRegion = "all"; // 지역 필터
let currentFilterCategory = "all"; // 카테고리 필터

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

const boardList = document.querySelector(".boardListContainer");

function feed() {
    boardList.innerHTML = "";

    const accessToken = localStorage.getItem("accessToken");
    axios
        .get("/api/recruit", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const recruitList = response.data;

            recruitList.forEach((recruits) => {
                if (
                    (currentFilterRegion === "all" ||
                        recruits.region.toString() === currentFilterRegion) &&
                    (currentFilterCategory === "all" ||
                        recruits.rule === currentFilterCategory)
                ) {
                    const newContent = document.createElement("div");
                    newContent.classList.add("item");
                    newContent.innerHTML = `
                        <div class="num">${recruits.id}</div>
                        <div class="category">${recruits.rule}</div>
                        <div class="title" ><a href="recruit-detail.html?id=${
                            recruits.id
                        }">${recruits.title}</a></div>
                        <div class="region">${region[recruits.region]}</div>
                        <div class="writer" onclick="openModal('${
                            recruits.hostId
                        }')">${recruits.hostName}</div>
                        <div class="gamedate">${recruits.gamedate.slice(
                            "T",
                            10,
                        )}</div>
                        <div class="status">${recruits.status}</div>
                    `;
                    boardList.appendChild(newContent);
                }
            });
        })
        .catch(function (error) {
            console.log(error.response.data);
            window.location.href = "index.html";
        });
}

function toRecruitPost() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "recruit-post.html";
    }
}

function filterByRegion() {
    const regionFilterElement = document.getElementById("regionFilter");
    currentFilterRegion = regionFilterElement.value;
    feed();
}

function filterByCategory() {
    const regionFilterElement = document.getElementById("CategoryFilter");
    currentFilterCategory = regionFilterElement.value;
    feed();
}

function openModal(hostId) {
    createModal(hostId);
}
