function openClubMatchModal() {
    urlParams = new URLSearchParams(window.location.search);

    // console.log("urlParams", urlParams);

    // const clubId = urlParams.get("id");
    // console.log("clubID", clubId);

    document.getElementById("clubMatchModal").style.display = "flex";
}

function closeClubMatchModal() {
    document.getElementById("clubMatchModal").style.display = "none";
}

async function clubMatchApplication() {
    event.preventDefault();

    try {
        urlParams = new URLSearchParams(window.location.search);

        const clubId = urlParams.get("id");

        const message = document.getElementById("message").value;
        const Information = document.getElementById("Information").value;
        const gamedate = document.getElementById("gamedate").value;
        const endtime = document.getElementById("endtime").value;

        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.post(
            `/api/clubmatch/${clubId}`,
            {
                message,
                Information,
                gamedate,
                endtime,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response.data);
        alert("매치를 신청하셨습니다.");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}
