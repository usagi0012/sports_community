document.addEventListener("DOMContentLoaded", function () {
    // 이벤트 리스너 등록
    document
        .getElementById("submitProfileButton")
        .addEventListener("click", postProfile);
});

async function postProfile() {
    // 사용자가 입력한 정보 가져오기
    const nickname = document.getElementById("nickname").value;
    const image = document.getElementById("file").files[0];
    const gender = document.getElementById("gender").value;
    const description = document.getElementById("description").value;
    const height = document.getElementById("height").value;
    const position = Array.from(
        document.querySelectorAll('input[name="position"]:checked'),
    ).reduce((acc, checkbox) => {
        acc[checkbox.value] = true;
        return acc;
    }, {});
    console.log(position);

    console.log(image);
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("file", image);
    formData.append("gender", gender);
    formData.append("description", description);
    formData.append("height", height);

    try {
        // Access token 가져오기
        const accessToken = localStorage.getItem("accessToken");
        console.log(formData);
        // Axios를 사용하여 서버에 POST 요청 보내기
        const response = await axios.post("/api/user/me/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const response2 = await axios.post("/api/user/me/position", position, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // 서버 응답 확인
        console.log(response, response2);

        // 성공적으로 처리된 경우에 대한 로직 추가
        alert("프로필이 성공적으로 업데이트되었습니다.");
        window.location.href = "/userProfile.html";
    } catch (error) {
        // 오류 처리
        console.log(error.response);
        console.error("프로필 업데이트 중 오류 발생:", error);
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        } else if (
            error.response.data.message ===
            "프로필을 이미 작성하셨습니다. 수정해주세요"
        ) {
            alert("프로필을 이미 작성하셨습니다. 수정해주세요");
        } else {
            alert("프로필 작성중 오류발생.");
        }
    }
}
