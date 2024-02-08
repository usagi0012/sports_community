window.onload = function () {
    loadHeader();
    displayHostClubMatchInfo();
    loadFooter();
};

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
            <div><strong>동아리: </strong> ${hostMatch.guest_club_name} </div>
            <p><strong>진행상황: </strong> ${hostMatch.progress}</p>    
            <p><strong>상태: </strong> ${hostMatch.status}</p>
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

        alert("삭제를 완료하였습니다.");
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

        alert("컴펌을 완료하였습니다.");
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
        const guestClub = response.data[1];
        const clubMatch = response.data[0];

        const guestClubHTML = createGuestClubHTML(guestClub);
        const hostClubButtonHTML = createHostClubButtonHTML(hostMatchId);
        const clubMatchHTML = createClubMatchHTML(clubMatch);
        const deleteButtonHTML = createDeleteButtonHTML(hostMatchId);

        guestClubContainer.innerHTML = guestClubHTML + clubMatchHTML;
        hostClubButtonContainer.innerHTML = hostClubButtonHTML;
        openHostMatchModal();
    } catch (error) {
        console.error(error);
        alert(error.response);
    }
}

function createDeleteButtonHTML(hostMatchId) {
    return ` 
    `;
}

function createGuestClubHTML(guestClub) {
    return `
        <div>
            <h2>FROM. ${guestClub.name}</h2>
            <p><strong>지역: </strong> ${guestClub.region}</p>
            <p><strong>점수: </strong> ${guestClub.score}</p>
            <p><strong>멤버 수: </strong> ${guestClub.members}</p>
        </div>
    `;
}

function createHostClubButtonHTML(hostMatchId) {
    return `
        <div class="hostClubButton">
            <button class="approveButton btn btn-success" onclick="approvebutton(${hostMatchId})">승인</button>
            <button class="rejectButton btn btn-danger" onclick="rejectbutton(${hostMatchId})">거절</button>
            <button class="deleteButton btn btn-danger" data-matchId="${hostMatchId}" onclick="deleteClubMatch(${hostMatchId})">삭제하기</button>   
            <button class="confirmButton btn btn-success" data-matchId="${hostMatchId}" onclick="confirmButton(${hostMatchId})">컴펌하기</button>
        </div>
    `;
}
function createClubMatchHTML(clubMatch) {
    return `
        <div class="matchInfo">
            <h2>경기정보</h2>
            <p><strong>메세지: </strong> ${clubMatch.message}</p>
            <p><strong>설명: </strong> ${clubMatch.information}</p>
            <p><strong>경기 시작 시간: </strong> ${clubMatch.gameDate.slice(
                "T",
                16,
            )}</p>
            <p><strong>경기 종료 시간: </strong> ${clubMatch.endTime.slice(
                "T",
                16,
            )}</p>
            <p><strong>과정: </strong> ${clubMatch.progress}</p>
            <p><strong>상태: </strong> ${clubMatch.status}</p>
            <p><strong>평가 완료 여부:</strong> ${clubMatch.host_evaluate}</p>
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
        alert("승인을 완료하였습니다.");
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

        alert("거절을 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}

function openHostMatchModal() {
    document.getElementById("hostMatchModal").style.display = "flex";
}

function closeHostMatchModal() {
    document.getElementById("hostMatchModal").style.display = "none";
}
