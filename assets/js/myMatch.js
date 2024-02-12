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
        console.log("myMatch", response.data);
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
        <div id="match-${match.id}" matchId="${
            match.id
        }" onclick="displayMatchUser(${match.id})">
            <h1>${match.recruitTitle}</h1>
            <div><strong>모집장: </strong> ${match.hostName} </div>
            <p><strong>경기 날자: </strong> ${match.gameDate.slice(0, 10)}</p>
            <p><strong>상태: </strong> ${match.status}</p>
            <p><strong>진행상황: </strong> ${match.progress}</p>
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

        // console.log(response.data);
        const myMatch = response.data[0];
        const confirmUser = response.data[1];

        console.log("myMatch", myMatch);

        console.log("confirmUser", confirmUser);

        const matchUser = document.getElementById("matchUser");
        matchUser.innerHTML = "";
        const userButton = document.getElementById("userButton");
        const matchInfo = document.getElementById("matchInfo");

        const matchUserButtonHtml = createMatchUserButtonHtml(matchId);
        const matchInfoHtml = createMatchInfoHtml(myMatch);

        confirmUser.forEach((user) => {
            const matchUserHtml = createMatchUserHtml(myMatch, user);

            matchUser.innerHTML += matchUserHtml;
        });

        matchInfo.innerHTML = matchInfoHtml;
        userButton.innerHTML = matchUserButtonHtml;

        document.getElementById("exampleModal").style.display = "block";
    } catch (error) {
        console.log(error);
        // alert(error.response.data.message);
        window.location.reload();
    }
}

function closeModal() {
    document.getElementById("exampleModal").style.display = "none";
}

function createMatchInfoHtml(myMatch) {
    return `
        <h2>${myMatch.recruitTitle}</h2>
        <p><strong>위치: </strong> ${myMatch.gps}</p>
        <p><strong>모집장: </strong> ${myMatch.hostName}</p>
        <p><strong>내용: </strong> ${myMatch.message}</p>
        <p><strong>경기시작시간: </strong> ${myMatch.gameDate.slice(
            0,
            10,
        )} ${myMatch.gameDate.slice(11, 19)}</p>
        <p><strong>경기종료시간: </strong> ${myMatch.endTime.slice(
            0,
            10,
        )} ${myMatch.endTime.slice(11, 19)}</p>
        <p><strong>상태: </strong> ${myMatch.status}</p>
        <p><strong>진행상황: </strong> ${myMatch.progress}</p>
    `;
}

function createMatchUserHtml(myMatch, user) {
    try {
        if (myMatch.progress !== "평가해주세요") {
            return `
            <div type="button" class="userInMatch">
             <p>${user.guestName}</p>
            </div>
            `;
        }

        const matchId = myMatch.id;
        console.log("matchId", matchId);
        const playOtherUserId = user.guestId;
        const isEvaluated =
            myMatch.evaluateUser &&
            myMatch.evaluateUser.includes(playOtherUserId.toString());

        const buttonText = isEvaluated ? "평가완료" : "평가";

        const buttonDisabled = isEvaluated ? "disabled" : "";

        return `
            <div type="button" class="userInMatch">
             <p>${user.guestName}</p>
            </div>
            <button class="userEvaluate"  onclick="displayPersonal('${matchId}', '${playOtherUserId}')" ${buttonDisabled}>${buttonText}</button>
        `;
    } catch (error) {
        alert(error);
    }
}

// 새로운 함수 추가
function handleUserButtonClick(userId) {
    createModal(userId);
}

function createMatchUserButtonHtml(matchId) {
    return `
        <div>
            <button  data-matchId="${matchId}" onclick="cancelButton(${matchId})">취소하기</button>
            <button  data-matchId="${matchId}" onclick="evaluateButton(${matchId})">평가완료</button>
 
            <button  data-matchId="${matchId}" onclick="deleteButton(${matchId})">삭제하기</button>
            <button  data-matchId="${matchId}" onclick="confirmButton(${matchId})">승인 확인</button>
        </div>
    `;
}

async function displayPersonal(matchId, playOtherUserId) {
    try {
        const personalEvaluation = document.getElementById("submit-btn");
        personalEvaluation.innerHTML = "";
        const personalEvaluationHTML = createpersonalEvaluationHTML(
            matchId,
            playOtherUserId,
        );
        personalEvaluation.innerHTML = personalEvaluationHTML;
        openPersonal();
    } catch (error) {}
}

function createpersonalEvaluationHTML(matchId, playOtherUserId) {
    console.log("createpersonalEvaluationHTML", matchId, playOtherUserId);
    return `
        <button onclick="submit('${matchId}', '${playOtherUserId}')" class="on">제출</button>
    `;
}

function openPersonal(confirmUser) {
    var modal = document.getElementById("myPersonal");

    modal.style.display = "block";
}

async function submit(matchId, playOtherUserId) {
    try {
        console.log("submit", matchId, playOtherUserId);
        await getPersonalAssessment(matchId, playOtherUserId);
        await getPersonalTag(matchId, playOtherUserId);
        await evaluateUser(matchId, playOtherUserId);
        alert("평가 완료");
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}

async function endPersonal() {
    const modal = document.getElementById("myPersonal");
    modal.style.display = "none";
}

//유저집어넣기
async function evaluateUser(matchId, playOtherUserId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        console.log(matchId);

        console.log(playOtherUserId);
        axios.post(
            `/api/match/evaluateUser/${playOtherUserId}/${matchId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log("유저집어넣기 성공");
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}
