async function displayHostClubMatchInfo() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get("/api/clubmatch/host", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(response.data);

        const hostMatchContainer = document.getElementById("hostClub-match");
        hostMatchContainer.innerHTML = "";

        response.data.forEach((hostMatch) => {
            const hostMatchHTML = createHostMatchHTML(hostMatch);
            hostMatchContainer.innerHTML += hostMatchHTML;
        });
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
    }
}

function createHostMatchHTML(hostMatch) {
    return `
    <div class="host-match-item">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#hostMatchModal" id="hostMatch-${hostMatch}" hostMatchId="${hostMatch.id}" onclick="getGuestClub(${hostMatch.id})">
            <h1>${hostMatch.message}</h1>
            <div><strong>호스트:</strong> ${hostMatch.guest_club_name} </div>
            <p><strong>게임 일자:</strong> ${hostMatch.gamedate}</p>
            <p><strong>경기 시간:</strong> ${hostMatch.endTime}</p>
            <p><strong>진행상황:</strong> ${hostMatch.progress}</p>
            <p><strong>상세정보:</strong> ${hostMatch.information}</p>
            <p><strong>상태:</strong> ${hostMatch.status}</p>
        </button>  
        <button class="deleteButton btn btn-danger" data-matchId="${hostMatch.id}" onclick="deleteClubMatch(${hostMatch.id})">삭제하기</button>
        <button class="confirmButton btn btn-success" data-matchId="${hostMatch.id}" onclick="confirmButton(${hostMatch.id})">컴펌하기</button>
    </div>
    `;
}

async function deleteClubMatch(hostMatchId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.delete(
            `/api/clubmatch/delete/${hostMatchId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response.data);

        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}

async function confirmButton(hostMatchId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.put(
            `/api/clubmatch/host/confirm/${hostMatchId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response.data);
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}

async function getGuestClub(hostMatchId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
            `/api/clubmatch/host/${hostMatchId}/user`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(hostMatchId);
        console.log(response);

        const guestClubContainer = document.getElementById("guestClub");
        guestClubContainer.innerHTML = "";
        const hostClubButtonContainer =
            document.getElementById("hostClubButton");
        hostClubButtonContainer.innerHTML = "";

        const guestClub = response.data;
        const guestClubHTML = createGuestClubHTML(guestClub);
        const hostClubButtonHTML = createhostClubButtonHTML(hostMatchId);
        guestClubContainer.innerHTML += guestClubHTML;
        hostClubButtonContainer.innerHTML += hostClubButtonHTML;

        $("#hostMatchModal").modal("show");
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}

function createGuestClubHTML(guestClub) {
    return `
        <div>
            <h2>${guestClub.name}</h2>
            ${
                guestClub.image
                    ? `<img src="${guestClub.image}" alt="Club Image">`
                    : ""
            }
            <p><strong>Region:</strong> ${guestClub.region}</p>
            <p><strong>Score:</strong> ${guestClub.score}</p>
            <p><strong>Members:</strong> ${guestClub.members}</p>
            <p><strong>Description:</strong> ${guestClub.description}</p>
        </div>
    `;
}

function createhostClubButtonHTML(hostMatchId) {
    return `
        <div class="hostClubButton">
            <button class="approveButton btn btn-success" onclick="approvebutton(${hostMatchId})">승인</button>
            <button class="rejectButton btn btn-danger" onclick="rejectbutton(${hostMatchId})">거절</button>
        </div>
    `;
}

async function approvebutton(hostMatchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.put(
            `/api/clubmatch/host/${hostMatchId}`,
            { status: "승인" },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        console.log("승인 성공");
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

async function rejectbutton(hostMatchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.put(
            `/api/clubmatch/host/${hostMatchId}`,
            { status: "거절" },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        console.log("거절 성공");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}
