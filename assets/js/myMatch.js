async function displayMatchInfo() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get("/api/match/me/", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data);
        const myMatch = document.getElementById("myMatch");
        myMatch.innerHTML = "";

        response.data.forEach((match) => {
            const myMatchHTML = createMatchHTML(match);
            const myMatchButtonHTML = createMatchButtonHTML(match);
            myMatch.innerHTML += [myMatchHTML, myMatchButtonHTML].join("");
        });
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

function createMatchHTML(match) {
    return `
    <button data-toggle="modal" data-target="#exampleModal">
        <div id="match-${match.id}" matchId="${match.id}" onclick="displayMatchUser(${match.id})">
            <h1>${match.recruitTitle}</h1>
            <div><strong>호스트:</strong> ${match.hostName} (ID: ${match.hostId})</div>
            <p><strong>주소:</strong> ${match.status}</p>
            <p><strong>게임 일자:</strong> ${match.gamedate}</p>
            <p><strong>진행상황:</strong> ${match.progress}</p>
            <p><strong>상태:</strong> ${match.status}</p>
        </div>
    </button>
    `;
}

function createMatchButtonHTML(match) {
    return `
    <div>
        <button class="deleteButton" data-matchId="${match.id}" onclick="deleteButton(${match.id})">삭제하기</button>
        <button class="confirmButton" data-matchId="${match.id}" onclick="confirmButton(${match.id})">컴펌하기</button>
    </div>
    `;
}

function closeModal() {
    var modal = document.getElementById("recruitMatch");
    modal.style.display = "none";
}

async function cancelButton(matchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.put(`/api/match/my/${matchId}/cancel`, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

async function deleteButton(matchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.delete(`/api/match/my/${matchId}/cancel/delete`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

async function confirmButton(matchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.put(`/api/match/my/${matchId}/confirm`, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}
//평가하기
async function evaluateButton(matchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.put(`/api/match/my/${matchId}/evaluate`, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

async function displayMatchUser(matchId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`/api/match/my/${matchId}/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(response.data);
        const matchUser = document.getElementById("matchUser");
        matchUser.innerHTML = "";
        const userButton = document.getElementById("userButton");
        const matchUserButton = createMatchUserButtonHtml(matchId);

        response.data.forEach((user) => {
            const matchUserHtml = createMatchUserHtml(user);
            matchUser.innerHTML += matchUserHtml;
        });

        userButton.innerHTML = matchUserButton;
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }

    function createMatchUserHtml(user) {
        return `
            <div>
                guestName: ${user.guestName}, progress: ${user.progress}
            </div>
        `;
    }

    function createMatchUserButtonHtml(matchId) {
        return `
            <div>
                <button class="cancelButton" data-matchId="${matchId}" onclick="cancelButton(${matchId})">취소하기</button>
                <button class="evaluateButton" data-matchId="${matchId}" onclick="evaluateButton(${matchId})">평가완료하기</button>
            </div>
        `;
    }
}
