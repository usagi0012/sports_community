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

            const clubApplication = document.createElement("div");
            mainContainer.appendChild(clubApplication);

            // 동아리 id가 아니라 동아리 번호로 수정하기
            const clubName = document.createElement("div");
            clubName.className = "clubId";
            clubName.innerHTML = `${response.data.data.clubName} 동아리`;
            clubApplication.appendChild(clubName);

            const message = document.createElement("div");
            message.className = "message";
            message.innerHTML = `${response.data.data.message}`;
            clubApplication.appendChild(message);

            const status = document.createElement("div");
            status.className = "status";
            status.innerHTML = `${response.data.data.status}`;
            clubApplication.appendChild(status);
        })
        .catch(function (error) {
            console.log(error);
        });
}
getMyApplication();
