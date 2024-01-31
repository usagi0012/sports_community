document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Access token 가져오기
        const accessToken = localStorage.getItem("accessToken");

        // 프로필 정보 가져오기
        const profileResponse = await axios.get("/api/user/me/profile", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(profileResponse);

        const profile = profileResponse.data.data.userProfile;
        document.getElementById("nickname").innerText = profile.nickname;

        // 이미지를 나타내는 img 태그를 동적으로 생성
        const imageElement = document.createElement("img");
        imageElement.src = profile.image;
        imageElement.alt = "프로필 이미지";
        // 생성한 img 태그를 span에 추가
        document.getElementById("image").appendChild(imageElement);

        document.getElementById("gender").innerText = profile.gender;
        document.getElementById("description").innerText = profile.description;
        document.getElementById("height").innerText = profile.height;

        // 평가 점수 가져오기
        try {
            const scoreResponse = await axios.get("/api/assessment/personal", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(scoreResponse.data.message);

            if (scoreResponse.data.success) {
                // 평가 점수가 있는 경우
                const score = scoreResponse.data.data;
                document.getElementById("score").innerText = score;
            } else {
                // 평가 점수가 없는 경우
                document.getElementById("score").innerText = "없음";
            }
        } catch (error) {
            // 에러 핸들링
            console.error("평가 점수 가져오기 중 에러 발생:", error);

            // 서버가 404를 반환하는 경우에 대한 추가 처리
            if (error.response && error.response.status === 404) {
                document.getElementById("score").innerText = "없음";
            } else {
                // 기타 에러 처리
                document.getElementById("score").innerText = "에러 발생";
            }
        }

        try {
            // 유저 태그 가져오기
            const tagResponse = await axios.get(
                "/api/assessment/personal/tag",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            if (tagResponse.data.success) {
                // 유저 태그가 있는 경우
                const tag = tagResponse.data.data;
                document.getElementById("tag").innerText = tag;
            } else {
                // 유저 태그가 없는 경우
                document.getElementById("tag").innerText = "없음";
            }
        } catch (error) {
            // 에러 핸들링
            console.error("유저 태그 가져오기 중 에러 발생:", error);

            // 서버 응답이 404일 때
            if (error.response && error.response.status === 404) {
                document.getElementById("tag").innerText = "없음";
            } else {
                // 기타 에러 처리
                document.getElementById("tag").innerText = "에러 발생";
            }
        }

        // 프로필 수정 버튼 클릭 이벤트
        document
            .getElementById("updateProfileButton")
            .addEventListener("click", function () {
                location.href = "/userProfile-update.html";
                console.log(location.href);
            });
        document
            .getElementById("calender")
            .addEventListener("click", function () {
                location.href = "/calender.html";
                console.log(location.href);
            });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        console.error("프로필 정보 및 업데이트 중 에러 발생:", error);
        console.log(error);
    }
});
