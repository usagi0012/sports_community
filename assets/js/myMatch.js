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
    <div>
    <button id="match-${match.id}" matchId="${match.id}" onclick="findRecruit(${match.id})">
        <h1>${match.recruitTitle}</h1>
        <div><strong>호스트:</strong> ${match.hostName} (ID: ${match.hostId})</div>
        <p><strong>주소:</strong> ${match.status}</p>
        <p><strong>게임 일자:</strong> ${match.gamedate}</p>
        <p><strong>진행상황:</strong> ${match.progress}</p>
        <p><strong>상태:</strong> ${match.status}</p>    
    </button>
    <div>
        <button class="cancelButton" data-matchId="${match.id}" onclick="cancelButton(${match.id})">취소하기</button>
        <!-- <button class="evaluateButton" data-matchId="${match.id}" onclick="evaluateButton(${match.id})">평가하기</button> -->
        <button class="deleteButton" data-matchId="${match.id}" onclick="deleteButton(${match.id})">삭제하기</button>
        <button class="confirmButton" data-matchId="${match.id}" onclick="confirmButton(${match.id})">컴펌하기</button>
    </div>    
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
