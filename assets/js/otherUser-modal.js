// 모달 생성 함수
async function createModal(userId) {
    //userId를 통해서 userName 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // 현재 클릭한 userId 저장
    const currentUserId = userId;

    // 유저 정보 가져오기
    let user;
    try {
        const response = await axios.get(`/api/user/${currentUserId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        user = response.data; // 응답에서 데이터만 가져오도록 수정
    } catch (error) {
        console.log("Error fetching user information:", error);
    }

    const userName = user.name;
    console.log("이름", userName);

    // 이미 열려 있는 모달 찾기
    const existingModal = document.getElementById("userProfileModal");
    if (existingModal) {
        // 모달이 이미 열려 있다면 내용을 업데이트하고 리턴
        updateModalContent(existingModal, userName, userId);
        return;
    }

    // 모달이 없는 경우에만 아래 코드 실행

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
    profileTitle.innerText = `${userName}의 프로필`;
    userProfileSection.appendChild(profileTitle);

    const nickname = document.createElement("p");
    nickname.innerHTML = `닉네임: <span id="modalNickname"></span>`;
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

    const score = document.createElement("p");
    score.innerHTML = `평가 점수: <span id="score"></span>`;
    userProfileSection.appendChild(score);

    const tag = document.createElement("p");
    tag.innerHTML = `유저 태그: <span id="tag"></span>`;
    userProfileSection.appendChild(tag);

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

// 모달 업데이트 함수
function updateModalContent(modal, userName, userId) {
    // 모달창 내의 프로필 정보를 가져오고 업데이트하는 함수 호출
    loadUserProfile(userId);

    // 모달창을 화면에 표시하는 코드 추가
    modal.style.display = "block";
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

        // userId를 이용하여 프로필 정보 가져오기
        let response;
        try {
            response = await axios.get(`/api/user/${userId}/profile`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return;
        }

        //userId를 이용하여 태그정보 가져오기
        let responseTag;
        try {
            responseTag = await axios.get(
                `/api/assessment/personal/tag/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
        } catch (error) {
            if (
                error.response.data.message ===
                "유저의 개인 태그를 찾을 수 없습니다."
            ) {
                document.getElementById("tag").innerText = "없음";
            }
            console.log("Error fetching user tags:", error);
        }

        //userId로 점수가져오기
        let responseScore;
        try {
            responseScore = await axios.get(
                `/api/assessment/personal/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
        } catch (error) {
            if (
                error.response.data.message === "유저 평점을 찾을 수 없습니다."
            ) {
                // "없음"을 표시할 요소의 innerText 설정
                document.getElementById("score").innerText = "없음";
            } else {
                // 다른 에러 처리 로직
                console.log("Error fetching user scores:", error);
            }
        }

        console.log("불러온 데이터", response.data.data.userProfile);
        const userProfile = response.data.data.userProfile;
        const userTag = responseTag?.data?.data || {};
        const top3Tag = Object.keys(userTag);
        const userAbility = responseScore?.data?.data?.ability;
        const userPersonality = responseScore?.data?.data?.personality;
        const imageContainer = document.getElementById("image");
        imageContainer.innerHTML = ""; // 기존 내용 초기화

        const imageElement = document.createElement("img");
        imageElement.src = userProfile.image;
        imageElement.alt = "User Image";
        imageContainer.appendChild(imageElement);

        console.log(userProfile.nickname);
        // 가져온 정보로 모달창 내의 프로필 부분을 업데이트
        document.getElementById("modalNickname").textContent =
            userProfile.nickname;
        document.getElementById("gender").textContent =
            userProfile?.gender || "없음";
        document.getElementById("description").textContent =
            userProfile?.description || "없음";
        document.getElementById("height").textContent =
            userProfile?.height || "없음";

        document.getElementById("score").textContent = `실력:${
            userAbility || "없음"
        } 인성:${userPersonality || "없음"}`;

        document.getElementById("tag").textContent =
            top3Tag.length > 0 ? top3Tag.join(", ") : "없음";
    } catch (error) {
        console.log(error.response.data);
        console.error("Error loading user profile:", error);
        // 에러 처리 로직 추가
    }
}
