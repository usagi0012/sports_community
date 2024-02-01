// otherUser-modal.js

// 모달 생성 함수
export function createModal(userId) {
    // 모달 창 생성
    const modal = document.createElement("div");
    modal.id = "userProfileModal";
    modal.className = "modal";

    // 모달 내용 생성
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // 프로필 정보 표시 부분을 생성하고 여기에 데이터를 채웁니다.
    const userProfileSection = document.createElement("section");
    userProfileSection.id = "userSection";

    const profileTitle = document.createElement("h2");
    profileTitle.innerText = `${userId}의 프로필`;
    userProfileSection.appendChild(profileTitle);

    const nickname = document.createElement("p");
    nickname.innerHTML = `닉네임: <span id="nickname"></span>`;
    userProfileSection.appendChild(nickname);

    const image = document.createElement("p");
    image.innerHTML = `이미지: <span id="image"></span>`;
    userProfileSection.appendChild(image);

    const gender = document.createElement("p");
    gender.innerHTML = `성별: <span id="gender"></span>`;
    userProfileSection.appendChild(gender);

    const description = document.createElement("p");
    description.innerHTML = `자기소개: <span id="description"></span>`;
    userProfileSection.appendChild(description);

    const height = document.createElement("p");
    height.innerHTML = `키: <span id="height"></span>`;
    userProfileSection.appendChild(height);

    // const score = document.createElement("p");
    // score.innerHTML = `평가 점수: <span id="score"></span>`;
    // userProfileSection.appendChild(score);

    // const tag = document.createElement("p");
    // tag.innerHTML = `유저 태그: <span id="tag"></span>`;
    // userProfileSection.appendChild(tag);

    modalContent.appendChild(userProfileSection);

    // 클로즈 버튼 추가
    const closeButton = document.createElement("button");
    closeButton.textContent = "모달 닫기";
    closeButton.onclick = closeUserModal;
    modalContent.appendChild(closeButton);

    // 모달 내용을 모달 창에 추가
    modal.appendChild(modalContent);

    // 모달을 body에 추가
    document.body.appendChild(modal);

    // 모달 열기
    openUserModal(userId);
}

// 유저 프로필 모달창 열기
function openUserModal(userId) {
    // 모달창 내의 프로필 정보를 가져오고 업데이트하는 함수 호출
    loadUserProfile(userId);

    // 모달창을 화면에 표시하는 코드 추가
    const modal = document.getElementById("userProfileModal");
    modal.style.display = "block";
}

// 유저 프로필 모달창 닫기
window.closeUserModal = function () {
    const modal = document.getElementById("userProfileModal");
    modal.style.display = "none";
};

// 유저 프로필을 불러오고 업데이트하는 함수
async function loadUserProfile(userId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        // userId를 이용하여 해당 유저의 프로필 정보를 가져옵니다.
        const response = await axios.get(`/api/user/${userId}/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const responseTag = await axios.get(`/api/personal/tag/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const responseScore = await axios.get(`/api/personal/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(responseTag);
        console.log(responseScore);

        console.log("불러온 데이터", response.data.data.userProfile);
        const userProfile = response.data.data.userProfile;

        const imageContainer = document.getElementById("image");
        imageContainer.innerHTML = ""; // 기존 내용 초기화

        const imageElement = document.createElement("img");
        imageElement.src = userProfile.image;
        imageElement.alt = "User Image";
        imageContainer.appendChild(imageElement);
        // 가져온 정보로 모달창 내의 프로필 부분을 업데이트
        document.getElementById("nickname").textContent = userProfile.nickname;
        document.getElementById("gender").textContent = userProfile.gender;
        document.getElementById("description").textContent =
            userProfile.description;
        document.getElementById("height").textContent = userProfile.height;
        //변경해야함
        // document.getElementById("score").textContent = userProfile.score;
        // document.getElementById("tag").textContent = userProfile.tag;
    } catch (error) {
        console.error("Error loading user profile:", error.message);
        // 에러 처리 로직 추가
    }
}
