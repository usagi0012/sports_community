document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Access token 가져오기
        const accessToken = localStorage.getItem("accessToken");

        // 프로필 정보 및 포지션 정보 가져오기
        const profileResponse = await axios.get("api/user/me/profile", {
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

        //선호 포지션 가져오기
        try {
            console.log("여긴들어오고");
            const positionResponse = await axios.get("/api/user/me/position", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (positionResponse)
                console.log("포지션 정보 가져오기", positionResponse);
            const positions = positionResponse.data.data.findPositionByUserId;

            if (!positions) {
                document.getElementById("position").innerText = "없음";
                console.log("포지션 정보 없음");
            }
            // positions 배열에서 true인 속성들을 필터링하여 추출
            const truePositions = positions.filter((position) => {
                return position.guard || position.forward || position.center;
            });

            // truePositions에서 true인 속성들의 이름을 추출
            const trueProperties = truePositions.map((position) => {
                return Object.entries(position)
                    .filter(([key, value]) => value === true)
                    .map(([key, value]) => key);
            });
            const showPosition = trueProperties.flat().join(", ");

            if (positionResponse.data.statusCode === 200) {
                const position = positionResponse.data.data;
                document.getElementById("position").innerText = showPosition;
            } else {
                // 포지션 정보가 없는경우
                document.getElementById("position").innerText = "없음";
            }
        } catch (error) {
            // 에러 핸들링
            console.error("프로필 정보 로드중 에러 발생:", error);

            // 서버가 404를 반환하는 경우에 대한 추가 처리
            if (error.response && error.response.status === 404) {
                document.getElementById("position").innerText = "없음";
            } else {
                // 기타 에러 처리
                document.getElementById("position").innerText = "에러 발생";
            }
        }

        // 평가 점수 가져오기
        try {
            const scoreResponse = await axios.get("api/assessment/personal", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(scoreResponse.data);

            if (scoreResponse.data.message === "개인 점수가 조회되었습니다.") {
                // 평가 점수가 있는 경우
                const score = scoreResponse.data.data;
                document.getElementById("score").innerText = `
                    실력 : ${score.abilityAmount}
                     인성 : ${score.personalityAmount}`;
            } else {
                // 평가 점수가 없는 경우
                document.getElementById("score").innerText = "없음";
            }
        } catch (error) {
            // 에러 핸들링
            console.log(error);
            document.getElementById("score").innerText = "없음";

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

            console.log(tagResponse.data);

            if (tagResponse.data.message === "개인 태그가 조회되었습니다.") {
                // 유저 태그가 있는 경우
                const tag = tagResponse.data.data;
                const tagsText = Object.keys(tag).join(", ");
                document.getElementById("tag").innerText = tagsText;
            } else {
                // 유저 태그가 없는 경우
                document.getElementById("tag").innerText = "없음";
            }
        } catch (error) {
            // 에러 핸들링
            document.getElementById("tag").innerText = "없음";

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
