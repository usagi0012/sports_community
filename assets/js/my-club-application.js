window.onload = function () {
    console.log("start");
    getMyClubApplication();
};

function getMyClubApplication() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    let clubId = urlParams.get("id");
    console.log("clubId", clubId);

    const authorized = localStorage.getItem("authorized");
    const token = JSON.parse(authorized).accessToken.value;

    axios
        .get(`api/applying-club/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error.response);
        });
}
