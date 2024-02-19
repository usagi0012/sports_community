window.onload = function () {
    loadHeader();
    loadFooter();
    loadUserMenu();
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // localStorage에서 토큰 읽기
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        // 토큰이 존재하는 경우에만 프로필 요청
        if (accessToken) {
            const response = await axios.get("/api/user/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const user = response.data;

            // 가져온 프로필 정보를 HTML에 추가
            const userSection = document.getElementById("userSection");
            userSection.innerHTML = `
              <h2>내 정보</h2>
              <p>이름: ${user.name}</p> 
              <p>이메일: ${user.email}</p>
             

      
              <button onclick="promptForCurrentPassword()">수정</button>
            `;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
});

async function promptForCurrentPassword() {
    // 비밀번호를 안전하게 입력받기 위해 사용자에게 입력 요청하는 모달 창 생성
    const passwordInput = await getPasswordInput();

    // 사용자가 비밀번호를 입력하고 확인 버튼을 눌렀을 때의 로직 수행
    if (passwordInput !== null) {
        // 여기에서 입력받은 비밀번호를 확인하고 수정 페이지로 이동하는 로직 수행
        redirectToUserUpdatePage(passwordInput);
    }
}

async function getPasswordInput() {
    return new Promise((resolve) => {
        // 모달 창 생성
        const modal = document.createElement("div");
        modal.id = "passwordModal";
        modal.innerHTML = `
                <label for="password">현재 비밀번호: </label>
                <input type="password" id="password" />
                <button onclick="submitPassword()">확인</button>
            </div>
        `;

        // 모달 창을 body에 추가
        document.body.appendChild(modal);

        // 확인 버튼 클릭 시 비밀번호 입력값을 resolve하는 함수 연결
        window.submitPassword = function () {
            const passwordInput = document.getElementById("password").value;
            // 모달 창 제거
            modal.remove();
            resolve(passwordInput);
        };
    });
}

async function redirectToUserUpdatePage(currentPassword) {
    try {
        // 토큰 읽기
        const accessToken = localStorage.getItem("accessToken");
        // 토큰이 존재하는 경우에만 서버로 현재 비밀번호 확인 요청
        if (accessToken) {
            const checkPasswordDto = {
                password: currentPassword,
            };

            const response = await axios.post(
                "/api/user/me/checkPassword",
                checkPasswordDto,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            // 서버에서 현재 비밀번호 확인 후 수정 페이지로 이동 여부 결정
            if (response.data.success) {
                alert("현재 비밀번호 확인 완료! 수정 페이지로 이동합니다.");
                // 페이지 이동
                window.location.href = `user-update.html?userId=${response.data.data}`;
            } else {
                alert(response.data.message);
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        console.log(typeof error);
        // 오류 처리 로직 추가
    }
}
