window.onload = function () {
    console.log("my-club-application 페이지");
    getMyClubApplication();
};

function getMyClubApplication() {
    // const urlParams = new URLSearchParams(window.location.search);
    // console.log("urlParams", urlParams);
    // let clubId = urlParams.get("id");
    // console.log("clubId", clubId);

    const token = localStorage.getItem("accessToken");

    axios
        .get(`api/applying-club`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log(response);
            alert(`${response.data.message}`);

            //userId , message, status
            response.data.data.forEach((application) => {
                console.log("어플", application);
                const myClubAppplicationList = document.querySelector(
                    ".my-club-application",
                );
                // 신청서 내용들을 하나로 감싸주는 div = clubApplication
                const clubApplication = document.createElement("div");
                clubApplication.className = `${clubApplication} ${application.userId} ${application.clubId}`;

                const user = document.createElement("div");
                user.className = "user";
                user.innerHTML = `${application.userId}`;
                clubApplication.appendChild(user);

                const message = document.createElement("div");
                message.className = "message";
                message.innerHTML = `${application.message}`;
                clubApplication.appendChild(message);

                const status = document.createElement("div");
                status.className = "status";
                status.innerHTML = `${application.status}`;
                clubApplication.appendChild(status);
                myClubAppplicationList.appendChild(clubApplication);

                const userAndClub = clubApplication.className.split(" ");
                const userId = userAndClub[2];
                const clubId = userAndClub[3];
                const token = localStorage.getItem("accessToken");

                const approveBtn = document.createElement("button");
                approveBtn.className = "approval";
                approveBtn.innerHTML = "승인";
                approveBtn.addEventListener("click", () => {
                    axios
                        .put(
                            `/api/applying-club/${clubId}/${userId}`,
                            {
                                permission: true,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        .then(function (response) {
                            console.log("신청서 리뷰 리스폰스", response);
                            //폼 제출 후 원래 페이지로 이동
                            alert(`동호회 가입을 승인했습니다.`);
                            location.reload();
                        })
                        .catch(function (error) {
                            console.log(error);

                            // 이 부분 세분화해서 에러 메세지별 에러메세지 띄우기
                            alert("동아리 신청서 처리 중 에러가 발생했습니다.");
                        });
                });
                clubApplication.appendChild(approveBtn);

                const rejectionBtn = document.createElement("button");
                rejectionBtn.className = "rejection";
                rejectionBtn.innerHTML = "거절";
                rejectionBtn.addEventListener("click", () => {
                    axios
                        .put(
                            `/api/applying-club/${clubId}/${userId}`,
                            {
                                permission: false,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        .then(function (response) {
                            console.log("신청서 리뷰 리스폰스", response);
                            //폼 제출 후 원래 페이지로 이동
                            alert(`동호회 가입을 거절했습니다.`);
                            location.reload();
                        })
                        .catch(function (error) {
                            console.log(error);

                            // 이 부분 세분화해서 에러 메세지별 에러메세지 띄우기
                            alert("동아리 신청서 처리 중 에러가 발생했습니다.");
                        });
                });
                clubApplication.appendChild(rejectionBtn);
            });
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response);
        });
}
