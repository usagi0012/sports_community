// cookie에 있는 token 값을 local로 이동하는 로직
window.onload = function () {
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

    const token = localStorage.getItem("accessToken");

    if (!token) {
        getProfile("home"); // load the home page by default
    } else {
        getProfile("login");
    }
};

// 각 cookie에 대한 토큰값
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

async function toHome() {
    window.location.href = "index.html";
}

//메뉴바 클릭시 이동
async function toRecruit() {
    window.location.href = "index.html";
}

async function toMyRecruit() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "myRecruit.html";
    }
}

async function toClub() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "club.html";
    }
}

async function toHome() {
    window.location.href = "index.html";
}

async function toHome() {
    window.location.href = "index.html";
}

//프로필 불러오기
const profileContainer = document.getElementsByClassName("profileContainer");
function getProfile(token) {
    let profile = "";
    if (token === "home") {
        profile = "";
    }
}
