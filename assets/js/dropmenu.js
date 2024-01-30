//메뉴바 클릭시 이동
async function toHome() {
    window.location.href = "index.html";
}

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
    window.location.href = "club.html";
}

async function toPlace() {
    window.location.href = "place.html";
}

// async function toHome() {
//     window.location.href = "index.html";
// }

async function logout() {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        axios
            .post("/api/auth/logout", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(function (response) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                document.cookie =
                    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie =
                    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                window.location.href = "index.html";
            })
            .catch(function (error) {
                console.log(error);
                alert("로그인 상태가 아닙니다.");
            });
    } else {
        alert("로그인 상태가 아닙니다.");
    }
}
