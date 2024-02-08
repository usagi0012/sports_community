window.onload = function () {
    loadHeader();
    getGuestMatch();
    loadFooter();
};

//guest매치 조회하기
async function getGuestMatch() {
    try {
        const accessToken = localStorage.getItem("accessToken");
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

// 게스트클럽 HTML 생성 함수
function createGuestClubMatchHTML(guestClubMatch) {
    return `
        <div class="guest-match-item">
            <button type="button" id="guestMatch-${guestClubMatch.id}" guestMatchId="${guestClubMatch.id}" onclick="findHostClub(${guestClubMatch.id})">
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

        openModal();
    } catch (error) {
        console.error(error);
        alert(error.response.data);
    }
}

function openModal() {
    const modal = document.getElementById("guestMatchModal");
    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("guestMatchModal");
    modal.style.display = "none";
}

function createMatchHTML(clubMatch) {
    return `
        <div> 
        <h2>경기 정보</h2>
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
        </div>
    `;
}

function createHostClubHTML(hostClub) {
    return `
    
        <div id="${hostClub.id}">
            <p><strong>이름: </strong> ${hostClub.name}</p>
            <p><strong>지역: </strong> ${hostClub.region}</p>
            <p><strong>점수: </strong> ${hostClub.score}</p>
            <p><strong>설명: </strong> ${hostClub.description}</p>
            <p><strong>멤버 수: </strong> ${hostClub.members}</p>
        </div>
    `;
}

function createGuestModalButtonHTML(clubMatch) {
    return `
    <div class="GuestClubButton">
        <button class="approveButton btn btn-danger" onclick="cancelGuestMatch(${clubMatch.id})">취소하기</button>
        <button class="rejectButton btn btn-success" onclick="confirmGuestMatch(${clubMatch.id})")">컴펌하기</button>
        <button class="deleteButton btn btn-danger" onclick="deleteGuestMatch(${clubMatch.id})">삭제하기</button>
    </div>
    `;
}

// 게스트 매치 취소하기
async function cancelGuestMatch(clubMatchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.put(
            `/api/clubmatch/guest/cancel/${clubMatchId}`,
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
async function confirmGuestMatch(clubMatchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.put(
            `/api/clubmatch/guest/confirm/${clubMatchId}`,
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
async function evaluateGuestMatch(clubMatchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.put(
            `/api/clubmatch/guest/evaluate/${clubMatchId}`,
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
async function deleteGuestMatch(clubMatchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.delete(`/api/clubmatch/delete/${clubMatchId}`, {
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
