async function displayRecruitInfo() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get("/api/recruit/my/post", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const myRecruit = document.getElementById("myRecruit-info");
        myRecruit.innerHTML = "";
        const myGuestButton = document.getElementById("recruitUserButton");
        myGuestButton.innerHTML = "";
        response.data.forEach((recruit) => {
            const myRecruitHTML = createRecruitHTML(recruit);
            const myRecruitButtonHTML = createRecruitButtonHTML(recruit);
            myRecruit.innerHTML += [myRecruitHTML, myRecruitButtonHTML].join(
                "",
            );
        });
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

function createRecruitHTML(recruit) {
    return `
        <button id="recruit-${recruit.id}" data-recruitId="${recruit.id}" onclick="findRecruit(${recruit.id})">
            <h1>${recruit.title}</h1>
            <p><strong>호스트:</strong> ${recruit.hostName} (ID: ${recruit.hostId})</p>
            <p><strong>지역:</strong> ${recruit.region}</p>
            <p><strong>규칙:</strong> ${recruit.rule}</p>
            <p><strong>게임 일자:</strong> ${recruit.gamedate}</p>
            <p><strong>종료 시간:</strong> ${recruit.endtime}</p>
            <p><strong>총 참가 인원:</strong> ${recruit.totalmember}</p>
            <p><strong>상태:</strong> ${recruit.status}</p>
        </button>
    `;
}

function createRecruitButtonHTML(recruit) {
    return `
        <div>
            <button data-toggle="modal" data-target="#recruitUserModal" class="경기진행과정" data-recruitId="${recruit.id}" onclick="displayRecruitUser(${recruit.id})">게스트</button>
            <button class="경기진행과정" data-recruitId="${recruit.id}" onclick="cancelButton(${recruit.id})">취소/삭제하기</button>
        </div>
    `;
}

// 경기 취소하기
async function cancelButton(recruitId) {
    const accessToken = localStorage.getItem("accessToken");
    console.log(recruitId);
    try {
        await axios.delete(`/api/recruit/my/post/${recruitId}`, {
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

async function findRecruit(recruitId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`/api/recruit/my/post/${recruitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const modalContentContainer = document.getElementById("recruitMatch");
        modalContentContainer.innerHTML = "";
        response.data.forEach((guest) => {
            const guestHTML = `
                <div id="recruitMatch-${guest.guestId}" matchId="${guest.guestId}">
                    <h1 style="font-size: smaller;"><strong>게스트:</strong>${guest.guestName}</h1>
                    <p style="font-size: smaller;"><strong>메세지:</strong>${guest.message}</p>
                    <p style="font-size: smaller;"><strong>상태:</strong>${guest.status}</p>

                </div>
            `;

            modalContentContainer.innerHTML += guestHTML;
        });

        $("#exampleModal").modal("show");
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

function closeModal() {
    var modal = document.getElementById("recruitMatch");
    modal.style.display = "none";
}

async function approvebutton(matchId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.put(
            `/api/recruit/my/post/match/${matchId}`,
            { status: "승인" },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        console.log("승인 성공");
        location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

async function rejectbutton(matchId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        await axios.put(
            `/api/recruit/my/post/match/${matchId}`,
            { status: "거절" },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        console.log("거절 성공");
    } catch (error) {
        console.error(error);
    }
}

async function displayRecruitUser(recruitId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
            `/api/recruit/my/post/${recruitId}/user`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response.data);

        const recruitUser = document.getElementById("recruitUser");
        recruitUser.innerHTML = "";
        const evaluate = document.getElementById("evaluateButton");
        const evaluateButton = createEvaluateButtonHtml(recruitId);

        response.data.forEach((user) => {
            const recruitUserHtml = createRecruitUserHtml(user);
            recruitUser.innerHTML += recruitUserHtml;
        });
        evaluate.innerHTML = evaluateButton;

        $("#recruitUserModal").modal("show");
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

function createRecruitUserHtml(user) {
    console.log(user);
    return `
        <div>
            guestName: ${user.guestName}, progress: ${user.progress}
        </div>
    `;
}

function createEvaluateButtonHtml(recruitId) {
    return `
        <div>
            <button class="evaluateButton" data-recruitId="${recruitId}" onclick="evaluateGuest(${recruitId})">평가완료하기</button>
        </div>
    `;
}

async function evaluateGuest(recruitId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.put(
            `/api/recruit/my/post/${recruitId}/evaluate`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

//모집글 삭제하기

// @Delete("my/post/:recurtId")
