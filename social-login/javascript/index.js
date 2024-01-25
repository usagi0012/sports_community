// cookie에 있는 token 값을 local로 이동하는 로직
window.onload = function () {
    setTimeout(function () {
        const cookieaccess = getCookie("accessToken");
        const cookierefresh = getCookie("refreshToken");

        if (cookieaccess && cookierefresh) {
            localStorage.setItem("accessToken", cookieaccess);
            localStorage.setItem("refreshToken", cookierefresh);

            // localStorage.setItem("accessToken");
            document.cookie =
                "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
                "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }, 100);
};

// 각 cookie에 대한 토큰값
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}