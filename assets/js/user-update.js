document.addEventListener("DOMContentLoaded", function () {
    getUserInfo();
    loadHeader();
    loadFooter();
    loadUserMenu();
});

//유저 정보 가져오기
async function getUserInfo() {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("/api/user/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const { email } = response.data;
        document.getElementById("email").value = email;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        console.error("Error fetching user info:", error);
    }
}

// 비밀번호 업데이트
async function updatePassword() {
    try {
        const newPassword = document.getElementById("newPassword").value;
        const newPasswordConfirm =
            document.getElementById("newPasswordConfirm").value;
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            if (newPassword !== newPasswordConfirm) {
                alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                return;
            }

            if (newPassword !== "") {
                const updateData = {
                    changePassword: newPassword,
                    changePasswordConfirm: newPasswordConfirm,
                };

                const response = await axios.put("/api/user/me", updateData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                alert("비밀번호 변경이 완료되었습니다.");
                window.location.href = "user.html";
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        console.error("Error updating password:", error);
        // 오류 처리 로직 추가
        alert("비밀번호 업데이트 중 오류가 발생했습니다. 에러를 확인하세요.");
    }
}
