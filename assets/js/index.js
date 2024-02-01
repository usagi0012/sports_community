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
        getProfile("home");
    } else {
        getProfile("login");
    }
    loadHeader();
    loadFooter();
};

// 각 cookie에 대한 토큰값
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

//프로필 불러오기
const profileContainer = document.getElementById("profileContainer");
function getProfile(token) {
    let profile = "";
    if (token === "home") {
        profileContainer.remove();
    } else if (token === "login") {
        profile = `
        <div class="image">
            <img src="resources/profile.jpeg" id="profileImage" />
        </div>
        <div class="nickname">닉네임</div>
        <div class="gender">
        </div>
        <div class="tag">
            <span id="tag1"> #커리 </span>
            <span id="tag2"> #커리 </span>
            <span id="tag3"> #커리 </span>
        </div>
        <div class="height">키: 190 cm</div>
        <div class="description">예시 소개입니다.</div>
        <div class="scoreContainer">
            <div class="score" id="personalityAmount">
                인성: <i class="fas fa-solid fa-star"></i> 4.2
            </div>
            <div class="score" id="abilityAmount">
                실력: <i class="fas fa-solid fa-star"></i> 4.6
            </div>
            <div class="score" id="MVPCount">MVP: 10 회</div>
        </div>
        <button type="button" id="alarmBtn">
            <i class="fas fa-solid fa-bell"></i>
        </button>
        <button type="button" id="profileUpdateBtn">
            수정하기
        </button>
        <div class="calenderContainer">
            <button type="button" id="calenderBtn">캘린더 →</button>
        </div>`;
    }
    profileContainer.innerHTML = profile;
}

{
    /* <div class="image">
<img src="resources/profile.jpeg" id="profileImage" />
</div>
<div class="nickname">닉네임</div>
<div class="noprofile">
아직 프로필이 없습니다. 프로필 작성 →
</div> */
}
