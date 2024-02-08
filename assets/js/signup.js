// 카운트다운 타이머 추가
function startCountdownTimer(seconds, redirectUrl) {
    const countdownTimer = document.getElementById("countdownTimer");
    countdownTimer.style.display = "block";

    let remainingSeconds = seconds;

    const timerInterval = setInterval(function () {
        countdownTimer.innerHTML = `인증 남은시간: ${remainingSeconds}초`;

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            countdownTimer.style.display = "none";
            handleTimeout(redirectUrl); // 시간 초과 시 실행되는 함수 호출
        }

        remainingSeconds--;
    }, 1000);
}

// 알림 및 이동 로직 수정
async function submitForm(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("signupForm"));

    try {
        const response = await axios.post("/api/auth/signup", {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            checkPassword: formData.get("passwordConfirm"),
            isVerified: false,
        });

        console.log(response.data);
        alert(
            "인증 메일이 전송되었습니다. 회원가입 완료를 위해 메일에서 인증을 진행해주세요.",
        );
        // 기존 카운트다운 로직 대신 인증 메일 발송 후에 카운트다운 시작
        startCountdownTimer(180, "login.html");
    } catch (error) {
        alert(error.response.data.message);
        console.log(error);
    }
}

// 시간 초과 시 실행되는 함수
function handleTimeout(redirectUrl) {
    const shouldResend = window.confirm(
        "인증시간이 지났습니다. 다시 인증 링크를 받으시겠습니까?",
    );

    if (shouldResend) {
        // 다시 인증 메일을 요청
        const formData = new FormData(document.getElementById("signupForm"));
        resendVerificationEmail(formData.get("email"));
    } else {
        // 사용자가 '아니오'를 선택한 경우, 리다이렉트
        window.location.href = redirectUrl;
    }
}

//인증메일 다시보내기
async function resendVerificationEmail(email) {
    try {
        const response = await axios.post("/api/auth/resendEmail", {
            email,
        });

        alert("인증 메일이 다시 전송되었습니다.");
        // 카운트다운 시작
        startCountdownTimer(180, "login.html");
    } catch (error) {
        // 에러 처리
        console.error(error);
        alert("인증 메일 재전송에 실패했습니다.");
    }
}

async function checkDuplicateEmail() {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    try {
        const response = await axios.get(
            `/api/user/email?email=${emailInput.value}`,
        );
        const existEmail = response.data.existEmail;

        if (!emailInput.value) {
            emailError.textContent = "이메일을 입력해주세요";
        } else if (!existEmail) {
            emailError.textContent = "사용 가능한 이메일입니다.";
        } else {
            emailError.textContent = "중복된 이메일입니다.";
        }
    } catch (error) {
        console.log(error);
    }
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
    naverLogin();
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
