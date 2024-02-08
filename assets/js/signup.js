async function submitForm(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("signupForm"));

    axios
        .post("/api/auth/signup", {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            checkPassword: formData.get("passwordConfirm"),
            isVerified: false,
        })
        .then(function (response) {
            console.log(response.data);
            alert(
                "인증 메일이 전송되었습니다. 회원가입 완료를 위해 메일에서 인증을 진행해주세요.",
            );
            window.location.href = "login.html";
        })
        .catch(function (error) {
            alert(error.response.data.message);
            console.log(error);
        });
}

async function checkDuplicateEmail() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    axios
        .get(`/api/user/email?email=${emailInput.value}`)
        .then(function (response) {
            const existEmail = response.data.existEmail;
            if (!emailInput.value) {
                emailError.textContent = "이메일을 입력해주세요";
            } else if (!existEmail) {
                emailError.textContent = "사용 가능한 이메일입니다.";
            } else {
                emailError.textContent = "중복된 이메일입니다.";
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function checkPasswordMatch() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");

    if (password !== confirmPassword) {
        passwordError.textContent = "비밀번호가 일치하지 않습니다.";
    } else {
        passwordError.textContent = "";
    }
}

document.getElementById("Kakao").addEventListener("click", function () {
    kakaoLogin();
});

document.getElementById("Naver").addEventListener("click", function () {
    needUpdateFunction();
    // naverLogin();
});

// 네이버 로그인을 위한 api 진입
function naverLogin() {
    window.location.href = "api/auth/naver";
}

// 카카오 로그인을 위한 api 진입
function kakaoLogin() {
    window.location.href = "api/auth/kakao";
}

async function toHome() {
    window.location.href = "index.html";
}

async function toForgotPassword() {
    window.location.href = "findPassword.html";
}

async function toHome() {
    window.location.href = "index.html";
}
