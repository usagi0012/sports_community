async function displayMatchInfo() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get("/api/recruit/my/post", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const myRecruit = document.getElementById("myRecruit-info");
        myRecruit.innerHTML = "";

        response.data.forEach((recruit) => {
            const myRecruitHTML = createRecruitHTML(recruit);
            myRecruit.innerHTML += myRecruitHTML;
        });
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

function createRecruitHTML(recruit) {
    return `
        <button  id="recruit-${recruit.id}" data-recruit-id="${recruit.id}" onclick="findRecruit(${recruit.id})">
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

             <button class="approveButton" data-guestId="${guest.id}" onclick="approvebutton(${guest.id})">찬성</button>
                <button class="rejectButton" data-guestId="${guest.id}" onclick="rejectbutton(${guest.id})">거절</button>
             </div>
            `;

            modalContentContainer.innerHTML += guestHTML;
        });

        var modal = new bootstrap.Modal(
            document.getElementById("exampleModal"),
        );
        modal.show();
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
            {
                status: "승인",
            },
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
            {
                status: "거절",
            },
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
