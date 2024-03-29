window.onload = function () {
    loadHeader();
    getMyClubApplication();
    loadFooter();
};

function getMyClubApplication() {
    const token = localStorage.getItem("accessToken");

    axios
        .get(`api/applying-club`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            response.data.data.applications.forEach((application, idx) => {
                const myClubAppplicationList = document.querySelector(
                    ".my-club-application",
                );
                // 신청서 내용들을 하나로 감싸주는 div = clubApplication
                const clubApplication = document.createElement("div");
                clubApplication.className = "clubApplicationCard";

                const nickName = response.data.data.nicknames[idx];
                const nickNameDiv = document.createElement("div");
                nickNameDiv.className = "nickNameDiv";
                nickNameDiv.innerHTML = `닉네임: ${nickName}`;

                // 클릭 이벤트를 추가하여 모달을 열도록 수정
                nickNameDiv.addEventListener("click", () => {
                    createModal(application.userId);
                });

                clubApplication.appendChild(nickNameDiv);

                const message = document.createElement("div");
                message.className = "message";
                message.innerHTML = `신청 메세지: ${application.message}`;
                clubApplication.appendChild(message);

                const status = document.createElement("div");
                status.className = "status";
                status.innerHTML = `상태: ${application.status}`;
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
                    const nickName =
                        approveBtn.parentElement.children[0].textContent.slice(
                            5,
                        );
                    axios
                        .put(
                            `/api/applying-club/review`,
                            {
                                permission: true,
                                nickName,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        )
                        .then(function (response) {
                            //폼 제출 후 원래 페이지로 이동
                            alert(`동호회 가입을 승인했습니다.`);
                            let checkToCreateChat = confirm(
                                "채팅방에 멤버를 초대하기 위해 채팅방으로 이동하시겠습니까?",
                            );
                            if (checkToCreateChat) {
                                window.location.href = "chatRoom.html";
                            } else {
                                location.reload();
                            }
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
                            `/api/applying-club/review`,
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
