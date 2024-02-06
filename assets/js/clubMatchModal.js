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

async function clubMatchApplication(event) {
    event.preventDefault();

    try {
        urlParams = new URLSearchParams(window.location.search);

        const clubId = urlParams.get("id");

        const message = document.getElementById("message").value;
        const information = document.getElementById("Information").value;
        const gameDate = document.getElementById("gamedate").value;
        const endTime = document.getElementById("endtime").value;

        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.post(
            `/api/clubmatch/${clubId}`,
            {
                message,
                information,
                gameDate,
                endTime,
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

    const accessToken = localStorage.getItem("accessToken");
    const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
    const userId = tokenPayload.userId;
    const eventSource = new EventSource(
        `http://localhost:8001/api/sse/${userId}`,
    );

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        showNotification(data.message);
    };

    eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
    };

    function showNotification(message) {
        // 브라우저 알림을 표시하는 로직
        if (Notification.permission === "granted") {
            new Notification("알림", { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("알림", { body: message });
                }
            });
        }
    }
}
