// 네이버 로그인을 위한 api 진입
function naverLogin() {
    window.location.href = "api/auth/naver";
}

// 카카오 로그인을 위한 api 진입
function kakaoLogin() {
    window.location.href = "api/auth/kakao";
}

// 로그아웃시 localStorage 토큰 값들을 삭제해줘야함
function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.reload();
}
