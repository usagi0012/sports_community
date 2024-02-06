window.onload = function () {
    loadHeader();
    displayMatchInfo();
    loadFooter();
};

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
            myMatch.innerHTML += myMatchHTML;
        });
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

function createMatchHTML(match) {
    return `
    <button type="button" >
        <div id="match-${match.id}" matchId="${match.id}" onclick="displayMatchUser(${match.id})">
            <h1>${match.recruitTitle}</h1>
            <div><strong>모집장:</strong> ${match.hostName} </div>
            <p><strong>게임 일자:</strong> ${match.gamedate}</p>
            <p><strong>상태:</strong> ${match.status}</p>
        </div>
    </button>
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

        alert("취소를 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
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

        alert("삭제를 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
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

        alert("컴펌을 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
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
        alert("평가를 완료하였습니다.");
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
        const myMatch = response.data[0];
        const confirmUser = response.data[1];

        const matchUser = document.getElementById("matchUser");
        matchUser.innerHTML = "";
        const userButton = document.getElementById("userButton");
        const matchInfo = document.getElementById("matchInfo");

        const matchUserButtonHtml = createMatchUserButtonHtml(matchId);
        const matchInfoHtml = createMatchInfoHtml(myMatch);

        confirmUser.forEach((user) => {
            const matchUserHtml = createMatchUserHtml(user);
            matchUser.innerHTML += matchUserHtml;
        });

        matchInfo.innerHTML = matchInfoHtml;
        userButton.innerHTML = matchUserButtonHtml;

        document.getElementById("exampleModal").style.display = "block";
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

function closeModal() {
    document.getElementById("exampleModal").style.display = "none";
}

function createMatchInfoHtml(myMatch) {
    return `
        <h2>${myMatch.recruitTitle}</h2>
        <p><strong>모집장:</strong> ${myMatch.hostName}</p>
        <p><strong>Message:</strong> ${myMatch.message}</p>
        <p><strong>Progress:</strong> ${myMatch.progress}</p>
        <p><strong>End Time:</strong> ${myMatch.endTime}</p>
        <p><strong>Game Date:</strong> ${myMatch.gameDate}</p>
        <p><strong>위치:</strong> ${myMatch.gps}</p>
        <p><strong>Status:</strong> ${myMatch.status}</p>
    `;
}

function createMatchUserHtml(user) {
    return `
            <button type="button" >
             ${user.guestName}, progress: ${user.progress}
            </button>
        `;
}

function createMatchUserButtonHtml(matchId) {
    return `
        <div>
            <button  data-matchId="${matchId}" onclick="cancelButton(${matchId})">취소하기</button>
            <button  data-matchId="${matchId}" onclick="evaluateButton(${matchId})">평가완료</button>
 
            <button  data-matchId="${matchId}" onclick="deleteButton(${matchId})">삭제하기</button>
            <button  data-matchId="${matchId}" onclick="confirmButton(${matchId})">컴펌하기</button>
             </div>
    `;
}
