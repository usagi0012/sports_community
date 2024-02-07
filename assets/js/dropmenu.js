//헤더 불러오기
const sameContainer = document.getElementById("sameContainer");
function loadHeader() {
    // sameContainer.innerHTML = "";
    sameContainer.innerHTML = `
    <div class="header">
    <div class="logo">
        <img
            src="resources/logo.png"
            id="logo"
            onclick="toHome()"
        />
    </div>
    <div id="searchBox">
        <form>
            <fieldset>
                <input type="search" maxlength="15"
                 placeholder="최대 15글자 입력가능합니다."/><button
                    type="submit"
                    id="searchBtn"
                >
                    <i class="fas fa-search"></i>
                </button>
            </fieldset>
        </form>
    </div>
    <div id="authBtn"></div>
    <div id="miniProfile" onclick="toUser()"></div>
</div>
<div class="menubarContainer">
    <div class="menuBar">
        <ul class="menu">
            <li id="recruit">
                <a href="#">모집</a>
                <ul class="detail" id="detailRecruit">
                    <li onclick="toRecruit()"><a href="#">모집글 목록</a></li>
                    <li onclick="toMyRecruit()">
                        <a href="#">내 모집글</a>
                    </li>
                </ul>
            </li>
            <li id="club">
                <a href="#">동아리</a>
                <ul class="detail" id="detailClub">
                    <li onclick="toClub()">
                        <a href="#">동아리 목록</a>
                    </li>
                    <li onclick="toMyClub()"><a href="#">내 동아리</a></li>
                </ul>
            </li>
            <li id="stadium" onclick="toPlace()">
                <a href="#">경기장</a>
            </li>
            <li id="platform">
                <a href="#">플랫폼 이용안내</a>
                <ul class="detail" id="detailPlatform">
                    <li><a href="#">이용 안내</a></li>
                    <li><a href="#">공지 사항</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Q&A</a></li>
                </ul>
            </li>
            <li id="talk" onclick="toChat()"><a href="#">Talk</a></li>
        </ul>
    </div>
</div>
    `;
    getAuthBtn();
    searchBtn();
}

//헤더 안에 로그아웃 상태면 로그인 버튼, 로그인 상태면 로그아웃 버튼
function getAuthBtn() {
    const authBtn = document.getElementById("authBtn");
    const miniProfile = document.getElementById("miniProfile");
    const token = localStorage.getItem("accessToken");
    try {
        authBtn.innerHTML = "";
        if (token) {
            axios
                .get("/api/user/me/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(function (response) {
                    const user = response.data.data.userProfile;
                    console.log(user);
                    authBtn.innerHTML = `
                    <div onclick="logout()">Log Out</div>`;
                    miniProfile.innerHTML = `
                    <div class="miniProfile"><img src="${user.image}" class="miniProfileImg" />${user.nickname}</div>
                    `;
                })
                .catch(function (error) {
                    console.log(error);
                    if (
                        error.response.data.message == "프로필 정보가 없습니다."
                    ) {
                        getName(token);
                    }
                    if (error.response.data.message == "accessToken expired") {
                        authBtn.innerHTML = `
                        <div onclick="logout()">Log Out</div>`;
                    }
                });
        } else {
            authBtn.innerHTML = `<div onclick="toLogin()">Log In</div>`;
        }
    } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        authBtn.innerHTML = "";
        authBtn.innerHTML = `<div onclick="toLogin()">Log In</div>`;
        console.log(error);
    }
}

//푸터 불러오기
const footer = document.getElementById("footer");
function loadFooter() {
    footer.innerHTML = `
    <div class="footerLogo">
    <img src="resources/logo.png" id="footerLogoImg" />
</div>
<a href="#" id="footerAnnounce">커뮤니티 이용 안내</a>
<a href="#" id="footerPrivacy">개인정보 처리 방침</a>
<p id="footerCall">문의) usagi001218@gmail.com</p>
<p id="footerSite">@Onong</p>
    `;
}

//유저 메뉴바 불러오기
function loadUserMenu() {
    const userMenuContianer = document.getElementById("userMenuContianer");
    userMenuContianer.innerHTML = `
    <ul>
        <li onclick="toUser()">사용자 정보</li>
        <li onclick="toUserProfile()">프로필</li>
        <li onclick="toCalender()">캘린더</li>
        <li onclick="toAlarm()">알림</li>
    </ul>
    `;
}

//이름 불러오기
async function getName(token) {
    axios
        .get("/api/user/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            const user = response.data;
            console.log(user);
            authBtn.innerHTML = `
            <div onclick="logout()">Log Out</div>
            `;
            miniProfile.innerHTML = `
            <div><img src="./resources/profile.jpeg" class="miniProfileImg"/>${user.name} 님<div>
            `;
        })
        .catch(function (error) {
            console.error("Error fetching profile:", error);
        });
}

function searchBtn() {
    const searchBox = document.getElementById("searchBox");
    const searchBtn = searchBox.querySelector("button");

    searchBtn.addEventListener("click", function (event) {
        event.preventDefault();

        // 여기에서 검색어를 입력하는 input 요소를 찾아옵니다.
        const searchInput = searchBox.querySelector("input[type=search]");
        const searchQuery = searchInput.value.trim(); // 검색어 값 가져오기

        let from = "";
        if (
            window.location.pathname.includes("club.html") ||
            window.location.pathname.includes("myClub.html")
        ) {
            from = "club";
        } else if (window.location.pathname.includes("place.html")) {
            from = "place";
        } else if (
            window.location.pathname.includes("recruit.html") ||
            window.location.pathname.includes("myRecruit.html")
        ) {
            from = "recruit";
        }

        if (from) {
            window.location.href = `search.html?from=${from}&q=${encodeURIComponent(
                searchQuery,
            )}`;
        } else {
            window.location.href = `search.html?q=${encodeURIComponent(
                searchQuery,
            )}`;
        }
    });
}

//메뉴바 클릭시 이동
//홈으로 이동
async function toHome() {
    window.location.href = "index.html";
}
//유저 정보 페이지 이동
async function toUser() {
    window.location.href = "user.html";
}
//유저 프로필 페이지 이동
async function toUserProfile() {
    window.location.href = "userProfile.html";
}
//유저 프로필 등록 페이지 이동
async function toPostUserProfile() {
    window.location.href = "userProfile-post.html";
}
//유저 프로필 수정 페이지 이동
async function toUpdateUserProfile() {
    window.location.href = "userProfile-update.html";
}
//알람 페이지 이동
async function toAlarm() {
    window.location.href = "alarm.html";
}
//캘린더 페이지 이동
async function toCalender() {
    window.location.href = "calender.html";
}
//모집글 페이지로 이동
async function toRecruit() {
    window.location.href = "recruit.html";
}
//내 모집글 페이지로 이동
async function toMyRecruit() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "myRecruit.html";
    }
}
//내가 신청한 모집글 페이지로 이동
async function toMyMatch() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "myMatch.html";
    }
}
//동아리 목록 페이지로 이동
async function toClub() {
    window.location.href = "club.html";
}
//동아리 매치 호스트 페이지로 이동
async function toMyClubHostMatch() {
    window.location.href = "hostClubMatch.html";
}
//동아리 매치 게스트 페이지로 이동
async function toMyClubGuestMatch() {
    window.location.href = "guestClubMatch.html";
}
//내 동아리 페이지로 이동
async function toMyClub() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인 후 이용 가능합니다.");
    }
    console.log("here");
    axios
        .get("/api/club/myClub", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log("제발", response);
            if (response.data.data === true) {
                alert("가입된 동아리가 없습니다.");
                window.location.href = "myApplication.html";
            } else {
                window.location.href = "myClub.html";
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log("백에서 return 잘 됐는데 왜 여기로 들어옴?ㄴ");
        });
}
//경기장 페이지로 이동
async function toPlace() {
    window.location.href = "place.html";
}

//준비중
function needUpdateFunction() {
    alert("업데이트 예정 서비스입니다.");
}

//로그아웃 하기
async function logout() {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        try {
            await axios.post("/api/auth/logout", null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // 성공적으로 로그아웃한 경우
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            document.cookie =
                "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
                "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            alert("로그아웃 되었습니다.");
            window.location.href = "index.html";
        } catch (error) {
            console.log(error);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "index.html";

            if (
                error.response &&
                error.response.data.message === "accessToken expired"
            ) {
                // 토큰이 만료된 경우
                localStorage.removeItem("accessToken");
                alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
                window.location.href = "index.html";
            }
        }
    } else {
        alert("로그아웃에 실패하였습니다.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "index.html";
    }
}

//로그인 페이지로 가기
async function toLogin() {
    window.location.href = "login.html";
}

// 채팅방 페이지로 가기
function toChat() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인 후 이용가능합니다.");
        return;
    }
    window.location.href = "chatRoom.html";
}
