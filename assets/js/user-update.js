document.addEventListener("DOMContentLoaded", function () {
    getUserInfo();
});

// function isValidEmail(email) {
//     // 간단한 이메일 유효성 검사를 위한 정규 표현식
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }

//이메일 변경시 인증코드 가져오기
// async function requestEmailChange() {
//     const emailInput = document.getElementById("email");
//     const email = document.getElementById("email").value;
//     const accessToken = localStorage.getItem("accessToken");
//     try {
//         // 서버에 현재 유저의 인증코드 상태를 확인
//         const response = await axios.get(
//             "http://localhost:8001/api/user/me/check-email-code",
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             },
//         );
//         const currentEmail = await axios.get(
//             "http://localhost:8001/api/user/me",
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             },
//         );
//         const currentEmails = currentEmail.data.email;
//         if (email === currentEmails) {
//             alert("현재 이메일 주소로는 변경이 불가능합니다.");
//             return;
//         }

//         if (response.data.checkEmailCode) {
//             alert("메일에서 인증번호를 확인해주세요.");
//             toggleVerificationCode();
//             emailInput.disabled = true;
//             return;
//         }
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             alert("로그인 후 이용해주세요.");
//             window.location.href = "http://localhost:8001/login.html";
//         }
//         console.error(error);
//     }

//     axios
//         .put(
//             "http://localhost:8001/api/user/me/request-email-change",
//             { email },
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             },
//         )
//         .then((response) => {
//             alert("이메일에 인증코드를 전송했습니다.");
//             // 서버로부터 받아온 인증 코드를 저장하거나 처리
//             const checkEmailCode = response.data.checkEmailCode;
//             // 화면에 인증 코드 입력을 위한 입력 창 표시
//             toggleVerificationCode();
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }

// function confirmEmailChange() {
//     const verificationCodeInput = document.getElementById("verificationCode");
//     const checkEmailCode = document.getElementById("verificationCode").value;
//     const accessToken = localStorage.getItem("accessToken");

//     axios
//         .put(
//             "/api/user/me/confirm-email",
//             { checkEmailCode },
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             },
//         )
//         .then((response) => {
//             console.log(response.data);
//             alert(`인증되었습니다.
// 이메일 변경 버튼을 눌러서 변경해주세요.`);
//             verificationCodeInput.disabled = true;
//         })
//         .catch((error) => {
//             if (error.response && error.response.status === 401) {
//                 alert("로그인 후 이용해주세요.");
//                 window.location.href = "/login.html";
//             }
//             console.error(error);
//             alert("인증에 실패했습니다.");
//         });
// }

// function toggleVerificationCode() {
//     const verificationCodeSection = document.getElementById(
//         "verificationCodeSection",
//     );

//     // 인증 코드 입력 창이 숨겨져 있다면 보이도록, 보이고 있다면 숨기도록 토글
//     if (verificationCodeSection.style.display === "none") {
//         verificationCodeSection.style.display = "block";
//     }
// }

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

// async function updateEmail() {
//     try {
//         const accessToken = localStorage.getItem("accessToken");
//         // 서버에 현재 유저의 인증코드 상태를 확인
//         const response = await axios.get(
//             "http://localhost:8001/api/user/me/check-email-code",
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             },
//         );
//         console.log(response.data.isVerifiedEmail);

//         if (response.data.isVerifiedEmail === false) {
//             alert("이메일 인증후 변경해주세요.");
//             toggleVerificationCode();
//             return;
//         }
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             alert("로그인 후 이용해주세요.");
//             window.location.href = "http://localhost:8001/login.html";
//         }
//         console.error(error);
//     }
//     try {
//         const newEmail = document.getElementById("email").value;
//         const accessToken = localStorage.getItem("accessToken");

//         if (accessToken) {
//             if (newEmail !== "") {
//                 if (!isValidEmail(newEmail)) {
//                     console.error("유효하지 않은 이메일 주소입니다.");
//                     alert("올바른 이메일 주소를 입력해주세요.");
//                     return;
//                 }

//                 const updateData = { email: newEmail };

//                 const response = await axios.put(
//                     "http://localhost:8001/api/user/me",
//                     updateData,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`,
//                         },
//                     },
//                 );

//                 alert("이메일 변경이 완료되었습니다.");
//                 window.location.href = "user.html";
//             }
//         }
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             alert("로그인 후 이용해주세요.");
//             window.location.href = "http://localhost:8001/login.html";
//         }
//         console.error("Error updating email:", error);
//         // 오류 처리 로직 추가
//         alert("이메일 업데이트 중 오류가 발생했습니다. 에러를 확인하세요.");
//     }
// }
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
