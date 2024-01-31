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

//호스트매치html
function createHostMatchHTML(hostMatch) {
    return `
    <div class="host-match-item">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#hostMatchModal" id="hostMatch-${hostMatch}" hostMatchId="${hostMatch.id}" onclick="getGuestClub(${hostMatch.id})">
            <h4>${hostMatch.message}</h4>
            <div><strong>게스트:</strong> ${hostMatch.guest_club_name} </div>
            <p><strong>진행상황:</strong> ${hostMatch.progress}</p>    
            <p><strong>상태:</strong> ${hostMatch.status}</p>
        </button>  
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

        const guestClubContainer = document.getElementById("guestClub");
        const hostClubButtonContainer =
            document.getElementById("hostClubButton");
        const deleteButtonContainer = document.getElementById("deletebutton");

        const guestClub = response.data[1];
        const clubMatch = response.data[0];

        const guestClubHTML = createGuestClubHTML(guestClub);
        const hostClubButtonHTML = createHostClubButtonHTML(hostMatchId);
        const clubMatchHTML = createClubMatchHTML(clubMatch);
        const deleteButtonHTML = createDeleteButtonHTML(hostMatchId);

        deleteButtonContainer.innerHTML = deleteButtonHTML;
        guestClubContainer.innerHTML = guestClubHTML + clubMatchHTML;
        hostClubButtonContainer.innerHTML = hostClubButtonHTML;

        $("#hostMatchModal").modal("show");
    } catch (error) {
        console.error(error);
        alert(error.response);
    }
}

function createDeleteButtonHTML(hostMatchId) {
    return ` 
    <button class="deleteButton btn btn-danger" data-matchId="${hostMatchId}" onclick="deleteClubMatch(${hostMatchId})">삭제하기</button>   
    `;
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

function createHostClubButtonHTML(hostMatchId) {
    return `
        <div class="hostClubButton">
            <button class="approveButton btn btn-success" onclick="approvebutton(${hostMatchId})">승인</button>
            <button class="rejectButton btn btn-danger" onclick="rejectbutton(${hostMatchId})">거절</button>
            <button class="confirmButton btn btn-success" data-matchId="${hostMatchId}" onclick="confirmButton(${hostMatchId})">컴펌하기</button>
        </div>
    `;
}
function createClubMatchHTML(clubMatch) {
    return `
        <div>
            <h2>경기정보</h2>
            <p><strong>Information:</strong> ${clubMatch.information}</p>
            <p><strong>Message:</strong> ${clubMatch.message}</p>
            <p><strong>End Time:</strong> ${clubMatch.endTime}</p>
            <p><strong>Game Date:</strong> ${clubMatch.gameDate}</p>
            <p><strong>Progress:</strong> ${clubMatch.progress}</p>
            <p><strong>evaluation:</strong> ${clubMatch.host_evaluate}</p>
            <p><strong>Status:</strong> ${clubMatch.status}</p>
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
