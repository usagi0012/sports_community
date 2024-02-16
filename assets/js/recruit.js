// import { createModal } from "./otherUser-modal.js";

window.onload = function () {
    loadHeader();
    feed();
    loadFooter();
};

let currentFilterRegion = "all"; // 지역 필터
let currentFilterCategory = "all"; // 카테고리 필터
let currentFilterStatus = "모집중";

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

            // id를 기준으로 내림차순 정렬
            recruitList.sort((a, b) => b.id - a.id);

            recruitList.forEach((recruits) => {
                if (
                    (currentFilterRegion === "all" ||
                        recruits.region.toString() === currentFilterRegion) &&
                    (currentFilterCategory === "all" ||
                        recruits.rule === currentFilterCategory) &&
                    (currentFilterStatus === "all" || // 모든 상태를 표시할 때
                        (currentFilterStatus === "모집중" &&
                            recruits.status === currentFilterStatus) ||
                        (currentFilterStatus === "모집완료" &&
                            recruits.status === currentFilterStatus))
                ) {
                    const newContent = document.createElement("div");
                    newContent.classList.add("item");

                    // 프로필 이름을 가져와서 바로 HTML에 삽입

                    profilName(recruits.hostId)
                        .then((profileName) => {
                            const writeName =
                                (profileName &&
                                    profileName.data &&
                                    profileName.data.userProfile &&
                                    profileName.data.userProfile.nickname) ||
                                recruits.hostName;

                            newContent.innerHTML = `
                                <div class="num">${recruits.id}</div>
                                <div class="category">${recruits.rule}</div>
                                <div class="title"><a href="recruit-detail.html?id=${
                                    recruits.id
                                }">${recruits.title}</a></div>
                                <div class="region">${
                                    region[recruits.region]
                                }</div>
                                <div class="writer" onclick="openModal('${
                                    recruits.hostId
                                }')">${writeName}</div>
                                <div class="gamedate">${recruits.gamedate.slice(
                                    0,
                                    10,
                                )}</div>
                                <div class="status">${recruits.status}</div>
                            `;
                            boardList.appendChild(newContent);
                        })
                        .catch((error) => {
                            console.error(
                                "프로필 이름을 가져오는 중 오류 발생:",
                                error,
                            );
                            return "";
                        });
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

function filterByStatus() {
    const statusFilterElement = document.getElementById("StatusFilter");
    currentFilterStatus = statusFilterElement.value;
    feed();
}

function openModal(hostId) {
    createModal(hostId);
}

function profilName(hostId) {
    const accessToken = localStorage.getItem("accessToken");

    return axios
        .get(`api/user/${hostId}/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            if (error.response && error.response.status === 404) {
                return ""; // 프로필이 없는 경우 빈 문자열 반환
            } else {
                console.error("프로필 이름을 가져오는 중 오류 발생:", error);
                return ""; // 기타 에러 발생 시에도 빈 문자열 반환
            }
        });
}
