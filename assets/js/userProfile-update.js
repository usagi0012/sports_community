window.onload = function () {
    loadHeader();
    loadFooter();
    loadUserMenu();
};

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

        // 기존 프로필 정보를 변수에 저장
        const profile = profileResponse.data.data.userProfile;

        // 기존 정보를 각 필드에 표시
        document.getElementById("nickname").value = profile.nickname;
        document.getElementById("gender").value = profile.gender;
        document.getElementById("description").value = profile.description;
        document.getElementById("height").value = profile.height;

        // 이미지를 나타내는 img 태그를 동적으로 생성
        const imageElement = document.createElement("img");
        imageElement.src = profile.image;
        imageElement.alt = "프로필 이미지";
        // 생성한 img 태그를 span에 추가
        document.getElementById("file").appendChild(imageElement);

        // 이미지 변경 처리
        const imageInput = document.getElementById("file");
        let newImage = null; // 새 이미지 변수

        imageInput.addEventListener("change", function (event) {
            // 이미지를 선택한 경우, 새 이미지 변수에 할당
            if (event.target.files.length > 0) {
                newImage = event.target.files[0];
            }
        });
        // 체크된 포지션 설정

        let positionResponse;
        try {
            positionResponse = await axios.get("api/user/me/position", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("포지션", positionResponse);
        } catch (positionError) {
            // 서버가 404를 반환하는 경우에 대한 추가 처리
            if (
                positionError.response &&
                positionError.response.status === 404
            ) {
                // 포지션 정보가 없는 경우, 여기에서 처리
                console.log("포지션 정보 없음");
                // 원하는 처리를 추가하세요. 예: 디폴트 값을 설정하거나, 에러 메시지를 표시하거나 등
            } else {
                // 기타 에러 처리
                console.error("포지션 정보 로드 중 에러 발생:", positionError);
            }
        }

        if (positionResponse) {
            const positionInfo =
                positionResponse.data.data.findPositionByUserId;
            document
                .querySelectorAll('input[name="position"]')
                .forEach((checkbox) => {
                    const positionName = checkbox.value;

                    // 포지션 정보를 찾음
                    const position = positionInfo.find(
                        (pos) => pos[positionName] === true,
                    );

                    // position이 존재하면 체크
                    const isChecked = position !== undefined;
                    checkbox.checked = isChecked;
                });
        }

        // 프로필 수정하기 버튼 클릭 이벤트
        document
            .getElementById("updateProfileButton")
            .addEventListener("click", async function () {
                try {
                    // 변경된 정보를 담을 객체 생성
                    const updatedProfile = {};
                    const updatedPositions = Array.from(
                        document.querySelectorAll(
                            'input[name="position"]:checked',
                        ),
                    ).reduce((acc, position) => {
                        acc[position.value] = true;
                        return acc;
                    }, {});

                    // 닉네임, 성별, 자기소개, 키 등의 입력 값을 읽어와서 객체에 추가
                    updatedProfile.nickname =
                        document.getElementById("nickname").value;
                    updatedProfile.gender =
                        document.getElementById("gender").value;
                    updatedProfile.description =
                        document.getElementById("description").value;
                    updatedProfile.height =
                        document.getElementById("height").value;

                    if (updatedProfile.gender !== profile.gender) {
                        return alert("성별은 변경할 수 없습니다.");
                    }

                    // 이미지를 선택한 경우에만 새 이미지를 서버로 전송
                    if (newImage) {
                        const formData = new FormData();
                        formData.append("file", newImage);

                        // 이미지를 서버로 업로드하고, 반환된 URL을 updatedProfile에 추가
                        const imageUploadResponse = await axios.put(
                            "api/user/me/profile",
                            formData,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                    "Content-Type": "multipart/form-data",
                                },
                            },
                        );

                        updatedProfile.image =
                            imageUploadResponse.data.data.updatedProfile.image;
                    }

                    // 변경된 프로필 정보를 서버로 전송
                    const updateProfileResponse = await axios.put(
                        "api/user/me/profile",
                        updatedProfile,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );
                    // 변경된 포지션 정보를 서버로 전송
                    const updatePositionResponse = await axios.put(
                        "api/user/me/position",
                        updatedPositions,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );

                    console.log(
                        "updatePositionResponse",
                        updatePositionResponse.data.data.updatedUserPosition,
                    );

                    // 성공적으로 업데이트되었다면, 페이지를 새로고침하거나 다른 조치를 취할 수 있습니다.
                    alert("프로필이 성공적으로 업데이트되었습니다.");
                    window.location.href = "/userProfile.html";
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        alert("로그인 후 이용해주세요.");
                        window.location.href = "/login.html";
                    }
                    // 에러 처리
                    console.error("프로필 업데이트 중 에러 발생:", error);
                }
            });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        // 에러 처리
        console.error("프로필 정보 가져오기 중 에러 발생:", error);
    }
});
