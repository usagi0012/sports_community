// userUpdate-modal.js

function openModal(modalId) {
    console.log(`openModal called with modalId: ${modalId}`);
    const modal = document.getElementById(modalId);
    console.log(modal);
    if (modal) {
        modal.style.display = "block";
        console.log("Modal is open");
    }
}
function closeModal(modalId) {
    console.log(`closeModal called with modalId: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}
async function updateUser(field) {
    try {
        console.log(`updateUser called with field: ${field}`);
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            let newValue;

            if (field === "email") {
                newValue = document.getElementById("newEmail").value;
            } else if (field === "password") {
                const currentPassword =
                    document.getElementById("password").value;
                const newPassword =
                    document.getElementById("newPassword").value;
                const newPasswordConfirm =
                    document.getElementById("newPasswordConfirm").value;

                // 비밀번호가 일치하는지 확인
                if (newPassword !== newPasswordConfirm) {
                    console.error("새 비밀번호가 일치하지 않습니다.");
                    return;
                }

                // 필요한 경우 현재 비밀번호도 확인할 수 있음
                // if (!currentPassword) {
                //     console.error('현재 비밀번호를 입력해주세요.');
                //     return;
                // }

                // 필요에 따라 현재 비밀번호를 서버에 전송할 수 있음
                // 비밀번호 업데이트 시에는 현재 비밀번호 확인 로직이 추가될 수 있음
                newValue = newPassword;
            }

            const response = await axios.put(
                `/api/user/me`,
                {
                    newValue: newValue,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            // 성공적으로 업데이트되면 모달을 닫거나 다른 작업 수행
            closeModal("userUpdateModal");
            // 필요한 경우 페이지 리로드 또는 업데이트된 정보 갱신
        }
    } catch (error) {
        console.error(`Error updating ${field}:`, error);
        // 오류 처리 로직 추가
    }
}
