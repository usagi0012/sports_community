//guest매치 조회하기
async function getGuestMatch() {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const response = await axios.get(`/api/clubmatch/guest`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data);

        const guestClubMatchContainer =
            document.getElementById("guestClubMatch");
        guestClubMatchContainer.innerHTML = "";

        response.data.forEach((guestClubMatch) => {
            const guestClubMatchHTML = createGuestClubMatchHTML(guestClubMatch);

            guestClubMatchContainer.innerHTML += guestClubMatchHTML;
        });
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
    }
}

//게스트클럽 html
function createGuestClubMatchHTML(guestClubMatch) {
    return `
        <div class="guest-match-item">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#guestMatchModal" id="guestMatch-${guestClubMatch.id}" guestMatchId="${guestClubMatch.id}" onclick="findHostClub(${guestClubMatch.id})">
            <h4>${guestClubMatch.message}</h4>    
            <p><strong>away Club Name:</strong> ${guestClubMatch.host_club_name}</p> 
            <p><strong>Status:</strong> ${guestClubMatch.status}</p>
            </button>
        </div>
    `;
}

// guest 매치 상세 조회
async function findHostClub(guestMatchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.get(
            `/api/clubmatch/guest/hostClub/${guestMatchId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response.data);

        const clubMatch = response.data[0];
        const hostClub = response.data[1];

        const hostClubContainer = document.getElementById("hostClub");
        const guestModalButtonContainer =
            document.getElementById("guestModalButton");

        hostClubContainer.innerHTML = "";
        guestModalButtonContainer.innerHTML = "";

        const guestModalButtonHTML = createGuestModalButtonHTML(clubMatch);
        const hostClubHTML = createHostClubHTML(hostClub);
        const matchHtml = createMatchHTML(clubMatch);

        guestModalButtonContainer.innerHTML += guestModalButtonHTML;
        hostClubContainer.innerHTML += hostClubHTML + matchHtml;

        $("#guestMatchModal").modal("show");
    } catch (error) {
        console.error(error);
        alert(error.response.data);
    }
}

function createMatchHTML(clubMatch) {
    return `
        <div> 
        <h2>경기 정보</h2>
            <p><strong>Message:</strong> ${clubMatch.message}</p>
            <p><strong>Information:</strong> ${clubMatch.information}</p>
            <p><strong>End Time:</strong> ${clubMatch.endTime}</p>
            <p><strong>Game Date:</strong> ${clubMatch.gameDate}</p>
            <p><strong>Guest Evaluation:</strong> ${clubMatch.guest_evaluate}</p>
            <p><strong>Host Evaluation:</strong> ${clubMatch.host_evaluate}</p>
            <p><strong>Progress:</strong> ${clubMatch.progress}</p>
            <p><strong>Status:</strong> ${clubMatch.status}</p>
        </div>
    `;
}

function createHostClubHTML(hostClub) {
    return `
    
        <div id="${hostClub.id}">
            <p><strong>Name:</strong> ${hostClub.name}</p>
            ${
                hostClub.image
                    ? `<img src="${hostClub.image}" alt="Club Image">`
                    : ""
            }
            <p><strong>Region:</strong> ${hostClub.region}</p>
            <p><strong>Score:</strong> ${hostClub.score}</p>
            <p><strong>Description:</strong> ${hostClub.description}</p>
            <p><strong>Members:</strong> ${hostClub.members}</p>
        </div>
    `;
}

function createGuestModalButtonHTML(guestMatchId) {
    return `
    <div class="GuestClubButton">
        <button class="approveButton btn btn-danger" onclick="cancelGuestMatch(${guestMatchId})">취소하기</button>
        <button class="rejectButton btn btn-success" onclick="confirmGuestMatch(${guestMatchId})")">컴펌하기</button>
        <button class="deleteButton btn btn-danger" onclick="deleteGuestMatch(${guestMatchId})">삭제하기</button>
    </div>
    `;
}

// 게스트 매치 취소하기
async function cancelGuestMatch(guestMatchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.put(
            `/api/clubmatch/guest/cancel/${guestMatchId}`,
            {
                status: "취소",
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        alert("취소를 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}

//게스트 컴펌하기
async function confirmGuestMatch(guestMatchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.put(
            `/api/clubmatch/guest/confirm/${guestMatchId}`,
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

//guest 경기 평가 완료하기
async function evaluateGuestMatch(guestMatchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.put(
            `/api/clubmatch/guest/evaluate/${guestMatchId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        alert("평가를 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}

//취소된 경기 삭제하기
async function deleteGuestMatch(guestMatchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.delete(`/api/clubmatch/delete/${guestMatchId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        alert("삭제를 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
        window.location.reload();
    }
}
