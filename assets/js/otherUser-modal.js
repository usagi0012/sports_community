// 모달 생성 함수
async function createModal(userId) {
    //userId를 통해서 userName 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // 현재 클릭한 userId 저장
    const currentUserId = userId;

    // 유저 정보 가져오기
    let result;

    try {
        const response = await axios.get(`/api/user/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        result = response.data;
    } catch (error) {
        console.error(error.response.data.error);
        throw error; // Rethrow the error for the calling code to handle
    }

    console.log("user전체", result);
    const user = result.user;
    const userName = user.name;
    const friend = result.isFriend;
    const block = result.isBlocked;

    console.log("이름", userName);

    // 프로필 정보 확인
    let userProfile;
    try {
        const profileResponse = await axios.get(
            `/api/user/${currentUserId}/profile`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        userProfile = profileResponse.data.data.userProfile;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("프로필을 등록하지 않은 사용자입니다.");
        return;
    }

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

    const likeOrHateHTML = createLikeOrHateHtml(userId, friend, block);

    // 모달 내용 생성
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // 프로필 정보 표시 부분을 생성하고 여기에 데이터를 채웁니다.
    const userProfileSection = document.createElement("section");
    userProfileSection.id = "userSection";

    const profileTitle = document.createElement("h2");
    profileTitle.innerText = `${userName}의 프로필`;
    userProfileSection.appendChild(profileTitle);

    const likeOrHate = document.createElement("div");
    likeOrHate.innerHTML = likeOrHateHTML;
    userProfileSection.appendChild(likeOrHate);

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
    score.innerHTML = `평가: <span id="score"></span>`;
    userProfileSection.appendChild(score);

    const tag = document.createElement("p");
    tag.innerHTML = `유저 태그: <span id="tag"></span>`;
    userProfileSection.appendChild(tag);

    modalContent.appendChild(userProfileSection);

    const userClub = document.createElement("p");
    userClub.innerHTML = `동아리: <span id="userClub"></span>`;
    userProfileSection.appendChild(userClub);

    // 클로즈 버튼 추가
    const closeButton = document.createElement("button");
    closeButton.textContent = "모달 닫기";
    closeButton.onclick = closeUserModal;
    modalContent.appendChild(closeButton);

    // 신고 모달 열기 버튼 추가
    const openReportModalButton = document.createElement("button");
    openReportModalButton.textContent = "신고하기";
    openReportModalButton.onclick = () => {
        openReportModal(userId);
    };
    modalContent.appendChild(openReportModalButton);

    // 모달 내용을 모달 창에 추가
    modal.appendChild(modalContent);

    // 모달을 body에 추가
    document.body.appendChild(modal);

    // 모달 열기
    openUserModal(userId);
}

function createLikeOrHateHtml(userId, friend, block) {
    if (friend === true) {
        return `

        <button type="button" onclick="cancelLike(${userId})"><i class="fas fa-solid fa-thumbs-up" style="color:blue;"></i></button>

         `;
    } else if (block === true) {
        return `

        <button type="button"  onclick="cancelHate(${userId})"><i class="fas fa-solid fa-thumbs-down" style="color:red;"></i></button>
        `;
    } else {
        return `

        <button type="button" onclick="Like(${userId})"><i class="fas fa-regular fa-thumbs-up"></i></button>
        <button type="button" onclick="Hate(${userId})"><i class="fas fa-regular fa-thumbs-down"></i></button>

        `;
    }
}
// post/friend/:otherUserId
async function Like(userId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
            `/api/user/post/friend/${userId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        location.reload();
    } catch (error) {
        alert(error.response.data.message);
    }
}
// delete/friend/:otherUserId
async function Hate(userId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
            `/api/user/post/block/${userId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        console.log("userId", userId);
        console.log(response);
        window.location.reload();

        // Assuming openUserModal is a synchronous function, call it after the page is reloaded
        openUserModal(userId);
    } catch (error) {
        alert(error.response.data.message);
    }
}

//Post("post/block/:otherUserId"
async function cancelLike(userId) {
    try {
        const confirmed = window.confirm("정말로 취소하시나요?");
        if (!confirmed) {
            return; // Do nothing if the user cancels
        }
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.delete(
            `/api/user/delete/friend/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response);
        window.location.reload();

        // Assuming openUserModal is a synchronous function, call it after the page is reloaded
        openUserModal(userId);
    } catch (error) {
        alert(error.response.data.message);
    }
}
// @Delete("delete/block/:otherUserId")
async function cancelHate(userId) {
    try {
        const confirmed = window.confirm("정말로 취소하시나요?");
        if (!confirmed) {
            return; // Do nothing if the user cancels
        }
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.delete(
            `/api/user/delete/block/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        console.log(response);
        window.location.reload();

        // Assuming openUserModal is a synchronous function, call it after the page is reloaded
        openUserModal(userId);
    } catch (error) {
        alert(error.response.data.message);
    }
}
async function openReportModal(userId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`/api/report/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { me, banUser } = response.data;

        const reporterUser = me;
        const reportedUser = banUser;
        const banUserId = reportedUser.id;

        const reportContainer = document.createElement("div");
        reportContainer.id = "reportModal";
        reportContainer.className = "reportModal";

        const reportContent = document.createElement("div");
        reportContent.id = "reportModal-content";
        reportContent.className = "reportModal-content";

        const reportSection = document.createElement("section");
        reportSection.id = "reportSection";

        const reportTitle = document.createElement("h2");
        reportTitle.innerText = "신고 양식";
        reportSection.appendChild(reportTitle);

        const form = document.createElement("form");

        const reporterLabel = document.createElement("label");
        reporterLabel.setAttribute("for", "reporterLabel");
        reporterLabel.innerText = "신고하는 사람:";
        reportSection.appendChild(reporterLabel);

        const reporterUserSpan = document.createElement("span");
        reporterUserSpan.id = "reporterUser";
        reporterUserSpan.innerText = reporterUser.name;
        reportSection.appendChild(reporterUserSpan);
        reportSection.appendChild(document.createElement("br"));

        const reportedLabel = document.createElement("label");
        reportedLabel.setAttribute("for", "reportedLabel");
        reportedLabel.innerText = "신고받는 사람:";
        reportSection.appendChild(reportedLabel);

        const reportedUserSpan = document.createElement("span");
        reportedUserSpan.id = "reportedUser";
        reportedUserSpan.innerText = reportedUser.name;
        reportSection.appendChild(reportedUserSpan);
        reportSection.appendChild(document.createElement("br"));

        const titleLabel = document.createElement("label");
        titleLabel.setAttribute("for", "title");
        titleLabel.innerText = "제목:";
        reportSection.appendChild(titleLabel);

        const titleTextarea = document.createElement("textarea");
        titleTextarea.id = "title";
        titleTextarea.name = "title";
        titleTextarea.rows = "1";
        titleTextarea.required = true;
        titleTextarea.maxLength = "20";
        titleTextarea.placeholder = "최대 20글자 입력가능합니다.";
        reportSection.appendChild(titleTextarea);
        reportSection.appendChild(document.createElement("br"));

        const reportContentLabel = document.createElement("label");
        reportContentLabel.setAttribute("for", "reportContent");
        reportContentLabel.innerText = "신고 내용:";
        reportSection.appendChild(reportContentLabel);

        const reportContentTextarea = document.createElement("textarea");
        reportContentTextarea.id = "reportContent";
        reportContentTextarea.name = "reportContent";
        reportContentTextarea.rows = "4";
        reportContentTextarea.required = true;
        reportContentTextarea.maxLength = "100";
        reportContentTextarea.placeholder = "최대 100글자 입력가능합니다.";
        reportSection.appendChild(reportContentTextarea);
        reportSection.appendChild(document.createElement("br"));

        reportContent.appendChild(reportSection);

        const submitButton = document.createElement("button");
        submitButton.className = "submit-button";
        submitButton.textContent = "신고 제출";
        submitButton.onclick = () => {
            const titleValue = document.getElementById("title").value;
            const reportContentValue =
                document.getElementById("reportContent").value;
            submitReport(banUserId, titleValue, reportContentValue);
        };

        const closeReportModalButton = document.createElement("button");
        closeReportModalButton.className = "reportModalClose-button";
        closeReportModalButton.textContent = "닫기";
        closeReportModalButton.onclick = closeReportModal;
        reportContent.appendChild(closeReportModalButton);

        reportContent.appendChild(submitButton);

        reportContainer.appendChild(reportContent);

        document.body.appendChild(reportContainer);

        openReportModalContainer();
    } catch (error) {
        console.error(error);
        alert(
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
                "An error occurred",
        );
    }
}

function openReportModalContainer() {
    const existingModal = document.getElementById("reportModal");
    existingModal.style.display = "flex";
}

// function closeReportModal() {
//     const reportContainer = document.getElementById("reportModal");
//     reportContainer.style.display = "none";
// }
function closeReportModal() {
    const reportContainer = document.getElementById("reportModal");
    reportContainer.style.display = "none";
}

function submitReport(banUserId, titleValue, reportContentValue) {
    console.log("제출함수시작");
    try {
        const accessToken = localStorage.getItem("accessToken");

        axios.post(
            `/api/report/${banUserId}`,
            {
                title: titleValue,
                reportContent: reportContentValue,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        alert("신고가 완료되었습니다.");
        closeReportModal();
    } catch (error) {
        console.log(error);
        alert(
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
                "An error occurred",
        );

        closeReportModal();
    }
}

// 모달 업데이트 함수
function updateModalContent(modal, userName, userId) {
    // 모달창 내의 프로필 정보를 가져오고 업데이트하는 함수 호출
    loadUserProfile(userId);

    // 모달창을 화면에 표시하는 코드 추가
    modal.style.display = "flex";
}

// 유저 프로필 모달창 열기
function openUserModal(userId) {
    // 모달창 내의 프로필 정보를 가져오고 업데이트하는 함수 호출
    loadUserProfile(userId);

    // 모달창을 화면에 표시하는 코드 추가
    const modal = document.getElementById("userProfileModal");
    modal.style.display = "flex";
}

// 유저 프로필 모달창 닫기
window.closeUserModal = function () {
    const modal = document.getElementById("userProfileModal");
    modal.style.display = "none";
    modal.remove();
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

        //userId로 동아리가져오기
        try {
            responseClub = await axios.get(`/api/club/getClub/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            clubId = responseClub.data;
            responseUserClub = await axios.get(`/api/club/${clubId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.log(error);
            if (error) {
                // "없음"을 표시할 요소의 innerText 설정
                document.getElementById("userClub").innerText = "없음";
            } else {
                // 다른 에러 처리 로직
                console.log("Error fetching user clubs:", error);
            }
        }
        console.log("불러온 데이터", response.data.data.userProfile);
        const userProfile = response.data.data.userProfile;
        const userTag =
            (responseTag && responseTag.data && responseTag.data) || {};
        const top3Tag = Object.keys(userTag);
        const userAbility =
            (responseScore &&
                responseScore.data &&
                responseScore.data.ability) ||
            null;
        const userPersonality =
            (responseScore &&
                responseScore.data &&
                responseScore.data.personality) ||
            null;
        const imageContainer = document.getElementById("image");
        const userClub =
            (responseUserClub &&
                responseUserClub.data &&
                responseUserClub.data.name) ||
            null;
        imageContainer.innerHTML = ""; // 기존 내용 초기화

        const imageElement = document.createElement("img");
        // userProfile.image가 비어있을 경우 기본 이미지 경로 설정
        imageElement.src = userProfile.image || "./resources/profile.jpeg";
        imageElement.alt = "User Image";
        imageContainer.appendChild(imageElement);

        if (userProfile.gender === "male") {
            document.getElementById("gender").textContent = "남성";
        } else if (userProfile.gender === "female") {
            document.getElementById("gender").textContent = "여성";
        }

        console.log(userProfile.nickname);
        // 가져온 정보로 모달창 내의 프로필 부분을 업데이트
        document.getElementById("modalNickname").textContent =
            userProfile.nickname;
        document.getElementById("description").textContent =
            userProfile && userProfile.description
                ? userProfile.description
                : "없음";

        document.getElementById("height").textContent =
            userProfile && userProfile.height ? userProfile.height : "없음";

        document.getElementById("score").textContent = `실력:${
            userAbility || "없음"
        } 인성:${userPersonality || "없음"}`;

        document.getElementById("tag").textContent =
            top3Tag.length > 0 ? top3Tag.join(", ") : "없음";

        document.getElementById("userClub").textContent = userClub || "없음";
    } catch (error) {
        console.log(error.response.data);
        console.error("Error loading user profile:", error);
        // 에러 처리 로직 추가
    }
}
