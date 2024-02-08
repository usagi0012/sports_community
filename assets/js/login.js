async function submitForm(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios
        .post("/api/auth/login", {
            email: email,
            password: password,
        })
        .then(function (response) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            console.log(response);
            window.location.href = "index.html";
        })
        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

document.getElementById("Kakao").addEventListener("click", function () {
    kakaoLogin();
});

document.getElementById("Naver").addEventListener("click", function () {
    // naverLogin();
    needUpdateFunction();
});

//준비중
function needUpdateFunction() {
    alert("업데이트 예정 서비스입니다.");
}

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
