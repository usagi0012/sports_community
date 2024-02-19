window.onload = function () {
    loadHeader();
    loadFooter();
    loadUserMenu();
    displayList();
};

//본인이 신청한 벤 조회하기
async function displayList() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get("/api/report/admin/banlist", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const adminList = document.getElementById("adminList");
        adminList.innerHTML = "";

        response.data.forEach((item) => {
            const adminListHTML = createAdminListHTML(item);
            adminList.innerHTML += adminListHTML;
        });
    } catch (error) {
        alert(error.response.data.message);
    }
}

function createAdminListHTML(item) {
    return `
        <div class="banDiv" id="${item.id}" onclick="openModal(${item.id})">
            <div id="${item.reportUserId}">신고 유저 이름: <span>${item.reportUserName}</span></div>
            <div id="${item.banUserId}">밴 유저 이름: <span>${item.banUserName}</span></div>
            <div>제목: <span>${item.title}</span></div>
            <div>상태: <span>${item.progress}</span></div>
        </div>
    `;
}

//모달 열기
async function openModal(reportId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`/api/report/admin/find/${reportId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const report = response.data;

        const adminBanModal = document.getElementById("adminBanModal");
        adminBanModal.innerHTML = "";

        const adminBanHTML = createAdminBan(report);
        adminBanModal.innerHTML = adminBanHTML;
        const banOptions = document.getElementById("banOptions");
        const disciplinaryInput = document.getElementById("disciplinaryPeriod");

        banOptions.addEventListener("change", function () {
            if (this.value === "disciplinary") {
                disciplinaryInput.style.display = "block";
            } else {
                disciplinaryInput.style.display = "none";
            }
        });
        var modal = document.getElementById("myModal");
        modal.style.display = "flex";
    } catch (error) {
        console.error(error);
    }
}

// 어드민 모달 창 HTML
function createAdminBan(report) {
    const banUser = report.banUser;
    const reportUser = report.reportUser;
    const createdAt = report.createdAt.split("T")[0];

    return `
                        <div>
                            <div>내용: ${report.reportContent}</div>
                            <div>접수날짜: ${createdAt}</div>
                        </div>
                        <div>
                            <select id="banOptions">
                                <option value="warning">경고</option>
                                <option value="penalty">징계</option>
                                <option value="permanentBan">영구 징계</option>
                            </select>
                            <input type="number" id="disciplinaryPeriod" placeholder="징계 기간 (일)" style="display: none;">

                            <button onclick="confirmAction(${banUser.id}, ${report.id})">확인</button>
                            <button onclick="rejectAction(${report.id})">거절</button>
                        </div>
                    `;
}

// 모달 열기
async function openModal(reportId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`/api/report/admin/find/${reportId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const report = response.data;

        const adminBanModal = document.getElementById("adminBanModal");
        adminBanModal.innerHTML = "";

        const adminBanHTML = createAdminBan(report);
        adminBanModal.innerHTML = adminBanHTML;

        const banOptions = document.getElementById("banOptions");
        const disciplinaryInput = document.getElementById("disciplinaryPeriod");

        banOptions.addEventListener("change", function () {
            if (this.value === "penalty") {
                disciplinaryInput.style.display = "block";
            } else {
                disciplinaryInput.style.display = "none";
            }
        });

        var modal = document.getElementById("myModal");
        modal.style.display = "flex";
    } catch (error) {
        console.error(error);
    }
}

function showFeedback(message) {
    alert(message);
}

async function confirmAction(banUserId, reportId) {
    const selectedOption = document.getElementById("banOptions").value;

    try {
        switch (selectedOption) {
            case "warning":
                await handleAction("warning", banUserId, reportId);
                showFeedback("경고 처리 완료하였습니다.");
                window.location.reload();
                break;
            case "penalty":
                await handleAction("penalty", banUserId, reportId);
                showFeedback("징계 처리 완료하였습니다.");
                window.location.reload();
                break;
            case "permanentBan":
                await handleAction("permanentBan", banUserId, reportId);
                showFeedback("영구 벤 처리 완료하였습니다.");
                window.location.reload();
                break;
            default:
                console.error("Invalid option");
        }
    } catch (error) {
        console.error(error);
        showFeedback("처리 중 오류가 발생했습니다.");
    } finally {
        closeModal();
    }
}
async function handleAction(actionType, banUserId, reportId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        let requestData = {};
        if (actionType === "penalty") {
            requestData = {
                duration: document.getElementById("disciplinaryPeriod").value,
            };
        }

        // 첫 번째 요청: 밴 처리
        const response = await axios.post(
            `/api/banlist/${actionType}/${banUserId}`,
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        // 두 번째 요청: 승인 처리
        const approve = await axios.put(
            `/api/report/admin/process/${reportId}`,
            {
                progress: "승인",
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // 에러 발생 시 즉시 예외를 던짐
    }
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
