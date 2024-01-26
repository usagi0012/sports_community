document.addEventListener("DOMContentLoaded", async () => {
    try {
        // localStorage에서 토큰 읽기
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        // 토큰이 존재하는 경우에만 프로필 요청
        if (accessToken) {
            const response = await axios.get(
                "http://localhost:8001/api/user/me",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            const user = response.data;

            // 가져온 프로필 정보를 HTML에 추가
            const userSection = document.getElementById("userSection");
            userSection.innerHTML = `
              <h2>내 정보</h2>
              <p>이름: ${user.name}</p> 
              <p>이메일: ${user.email}</p>
              <p>비밀번호: ********</p> 
             

      
              <button onclick="promptForCurrentPassword()">수정</button>
            `;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
});

function promptForCurrentPassword() {
    // 현재 비밀번호를 입력받는 얼럿창을 띄우기
    const currentPassword = prompt("현재 비밀번호를 입력하세요:");

    if (currentPassword !== null) {
        // 사용자가 취소하지 않았을 경우, 입력받은 비밀번호를 확인하고 수정 페이지로 이동
        redirectToUserUpdatePage(currentPassword);
    }
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
                "http://localhost:8001/api/user/me/checkPassword",
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
        console.log(error);
        // 오류 처리 로직 추가
    }
}
