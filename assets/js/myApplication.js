window.onload = function () {
    loadHeader();
    loadFooter();
    getMyApplication();
};

function getMyApplication() {
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get("/api/applying-club/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            console.log(response);

            const mainContainer = document.querySelector(".mainContainer");
            if (response.data.error == "지원서가 존재하지 않습니다.") {
                console.log("hi");
                return (mainContainer.innerHTML = `동아리 지원 내역이 없습니다.`);
            } else {
                const clubApplication = document.createElement("div");
                clubApplication.className = "myApplicationCard";
                mainContainer.appendChild(clubApplication);

                // 동아리 id가 아니라 동아리 번호로 수정하기
                const clubName = document.createElement("div");
                clubName.className = "clubId";
                clubName.innerHTML = `이름 : ${response.data.data.clubName} `;
                clubApplication.appendChild(clubName);

                const message = document.createElement("div");
                message.className = "message";
                message.innerHTML = `신청 메세지 : ${response.data.data.message}`;
                clubApplication.appendChild(message);

                const status = document.createElement("div");
                status.className = "status";
                status.innerHTML = `상태 : ${response.data.data.status}`;
                clubApplication.appendChild(status);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
