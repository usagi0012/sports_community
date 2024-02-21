window.onload = function () {
    loadHeader();
    displayRecruitInfo();
    loadFooter();
};

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
            myRecruit.innerHTML += [myRecruitHTML + myRecruitButtonHTML];
        });
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

function createRecruitHTML(recruit) {
    return `
        <button type="button" class="recruitBtn" onclick="findRecruit(${
            recruit.id
        })">
            <h1>${recruit.title}</h1>
            <p><strong>규칙 :</strong> ${recruit.rule}</p>
            <p><strong>경기 날짜 :</strong> ${recruit.gamedate.slice(
                "T",
                10,
            )}</p>
            <p><strong>상태 :</strong> ${recruit.status}</p>
        </button>
    `;
}

function createRecruitButtonHTML(recruit) {
    return `
        <div class="recruitListBtn">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#recruitUserModal" onclick="application(${recruit.id})">신청목록</button>
        </div>
    `;
}

// 모집글 상세정보(모달창1)
async function findRecruit(recruitId) {
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

        const confirmUsers = response.data[1];
        const findRecruit = response.data[0];

        const myRecruitUser = document.getElementById("recruitMatch");
        myRecruitUser.innerHTML = "";
        const myRecruitMatch = document.getElementById("myRecruit");
        myRecruitMatch.innerHTML = "";

        const recurtIdButton = document.getElementById("RecruitButton");
        recurtIdButton.innerHTML = "";

        //경기에 참석하는 유저 정보
        confirmUsers.forEach((confirmUser) => {
            const confirmUsersHTML = createConfirmUsersHTML(
                findRecruit,
                confirmUser,
            );
            myRecruitUser.innerHTML += confirmUsersHTML;
        });
        //매치 상세정보
        const myRecruitMatchHTML = createmyRecruitMatchHTML(findRecruit);
        myRecruitMatch.innerHTML = myRecruitMatchHTML;
        //모집글 상세보기 모달창에 쓰이는 버튼
        const recurtIdButtonHTML = createRecurtIdButtonHTML(findRecruit);
        recurtIdButton.innerHTML = recurtIdButtonHTML;

        openRecruitModal();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

function openRecruitModal() {
    const modal = document.getElementById("myRecruitModal");
    modal.style.display = "block";
}

function closeRecruitModal() {
    const modal = document.getElementById("myRecruitModal");
    modal.style.display = "none";
}

function createRecurtIdButtonHTML(findRecruit) {
    if (findRecruit.progress === "경기전") {
        return `
    <div>
    <button type="button" class="btn btn-danger"  onclick="deleteButton(${findRecruit.id})">삭제하기</button>
    </div>
`;
    }

    if (findRecruit.progress === "경기중") {
        return `
        <div>
        </div>
    `;
    }
    if (findRecruit.progress === "평가해주세요") {
        return `
        <div> 
        <button type="button" class="btn btn-success"  onclick="evaluateGuest(${findRecruit.id})">평가완료하기</button>
        </div>
    `;
    }

    if (findRecruit.progress === "평가 완료") {
        return `
        <div> 
        <button type="button" class="btn btn-danger"  onclick="deleteButton(${findRecruit.id})">삭제하기</button>
        </div>
    `;
    }
    return `
    <div>
        <button type="button" class="btn btn-success"  onclick="evaluateGuest(${findRecruit.id})">평가완료하기</button>
        <button type="button" class="btn btn-danger"  onclick="deleteButton(${findRecruit.id})">삭제하기</button>
    </div>
`;
}

function createConfirmUsersHTML(findRecruit, confirmUser) {
    if (findRecruit.progress !== "평가해주세요") {
        return `
            <div type="button" class="userInMatch">
                <p><strong>Name:</strong> ${confirmUser.guestName}</p>
                <p><strong>Status:</strong> ${confirmUser.status}</p>
            </div>
        `;
    }

    const matchId = confirmUser.id;
    const playOtherUserId = confirmUser.guestId;
    const recruitId = confirmUser.recruitId;

    const isEvaluated =
        findRecruit.evaluateUser &&
        findRecruit.evaluateUser.includes(playOtherUserId.toString());

    const buttonText = isEvaluated ? "평가완료" : "평가";

    const buttonDisabled = isEvaluated ? "disabled" : "";

    return `
        <div type="button" class="userInMatch">
            <p><strong>Name:</strong> ${confirmUser.guestName}</p>
            <p><strong>Status:</strong> ${confirmUser.status}</p>
        </div>
        <button onclick="displayPersonal('${recruitId}','${matchId}', '${playOtherUserId}')" ${buttonDisabled}>${buttonText}</button> 
    `;
}

function createmyRecruitMatchHTML(findRecruit) {
    return `
<div>
    <h3>${findRecruit.title}</h3>
    <p><strong>위치: </strong> ${findRecruit.gps}</p>
    <p><strong>모집장: </strong> ${findRecruit.hostName}</p>
    <p><strong>지역: </strong> ${findRecruit.region}</p>
    <p><strong>경기방식: </strong> ${findRecruit.rule}</p>
    <p><strong>모집인원: </strong> ${findRecruit.totalmember}</p>
    <p><strong>경기시작시간: </strong> ${findRecruit.gamedate.slice(
        0,
        10,
    )} ${findRecruit.gamedate.slice(11, 19)}</p>
    <p><strong>경기종료시간: </strong> ${findRecruit.endtime.slice(
        0,
        10,
    )}  ${findRecruit.endtime.slice(11, 19)}</p>
    <p><strong>내용: </strong> ${findRecruit.content}</p>
    <p><strong>상태: </strong> ${findRecruit.status}</p>
    <p><strong>진행상황: </strong> ${findRecruit.progress}</p>
</div>
`;
}

// 모집글 삭제하기
async function deleteButton(recruitId) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        await axios.delete(`/api/recruit/my/post/${recruitId}`, {
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
//경기 평가하기
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

        console.log(response.data);
        alert("평가를 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

//신청목록보기(모달창 2)
async function application(recruitId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`/api/recruit/my/post/${recruitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const guestData = response.data[1];

        const modalContentContainer = document.getElementById("recruitUser");
        modalContentContainer.innerHTML = "";

        guestData.forEach((guest) => {
            const guestHTML = createGuestHTML(guest);
            const buttonHTML = createButtonHTML(guest);
            modalContentContainer.innerHTML += [guestHTML + buttonHTML];
        });
        openRecruitUserModal();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

function createGuestHTML(guest) {
    return `
    <button type="button" >
    <h7><strong></strong>${guest.message}</h7>
        <p><strong>게스트:</strong><span class="guestName" onclick="createModal('${guest.guestId}')">${guest.guestName}</span></p>
        <p ><strong>상태:</strong>${guest.status}</p>
    </button>
    `;
}

function createButtonHTML(guest) {
    return `
        <div>
            <button type="button"   onclick="approvebutton(${guest.id})">승인</button>
            <button type="button"   onclick="rejectbutton(${guest.id})">거절</button>

        </div>
    `;
}

//경기승인하기

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

        alert("승인을 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

//경기거절하기

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

        alert("거절을 완료하였습니다.");
        window.location.reload();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
        window.location.reload();
    }
}

//
function createRecruitUserHtml(user) {
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

function openRecruitUserModal() {
    const modal = document.getElementById("recruitUserModal");

    modal.style.display = "block";
}

function closeRecruitUserModal() {
    const modal = document.getElementById("recruitUserModal");
    modal.style.display = "none";
}

//평가하기
async function displayPersonal(recruitId, matchId, playOtherUserId) {
    try {
        const personalEvaluation = document.getElementById("submit-btn");
        personalEvaluation.innerHTML = "";
        const personalEvaluationHTML = createpersonalEvaluationHTML(
            recruitId,
            matchId,
            playOtherUserId,
        );
        personalEvaluation.innerHTML = personalEvaluationHTML;
        openPersonal();
    } catch (error) {}
}

function createpersonalEvaluationHTML(recruitId, matchId, playOtherUserId) {
    return `
        <button onclick="submit('${recruitId}','${matchId}', '${playOtherUserId}')" class="on">제출</button>
    `;
}

function openPersonal(confirmUser) {
    var modal = document.getElementById("myPersonal");

    modal.style.display = "block";
}

async function submit(recruitId, matchId, playOtherUserId) {
    try {
        await getPersonalAssessment(matchId, playOtherUserId);
        await getPersonalTag(matchId, playOtherUserId);
        await evaluateUser(playOtherUserId, recruitId);

        alert("평가완료");
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}

function endPersonal() {
    var modal = document.getElementById("myPersonal");
    modal.style.display = "none";
}

//유저집어넣기
async function evaluateUser(playOtherUserId, recruitId) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        axios.post(
            `/api/recruit/post/evaluateUser/${playOtherUserId}/${recruitId}`,
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
