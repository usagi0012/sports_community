window.onload = function () {
    console.log("my-club-application 페이지");
    getMyClubApplication();
};

function getMyClubApplication() {
    // const urlParams = new URLSearchParams(window.location.search);
    // console.log("urlParams", urlParams);
    // let clubId = urlParams.get("id");
    // console.log("clubId", clubId);

    // const authorized = localStorage.getItem("authorized");
    // const token = JSON.parse(authorized).accessToken.value;
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
                const user = document.createElement("div");
                user.className = "user";
                user.innerHTML = `${application.userId}`;
                myClubAppplicationList.appendChild(user);
                console.log("뭐가나옴?", response.data);

                const message = document.createElement("div");
                message.className = "message";
                message.innerHTML = `${application.message}`;
                myClubAppplicationList.appendChild(message);

                const status = document.createElement("div");
                status.className = "status";
                status.innerHTML = `${application.status}`;
                myClubAppplicationList.appendChild(status);
            });
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.response);
        });
}
