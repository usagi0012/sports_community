window.onclick = function (event) {
    if (event.target == document.getElementById("banApplication")) {
        closeModal();
    }
};
async function openModal() {
    try {
        const banUserId = 2;
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`/api/report/${banUserId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { me, banUser } = response.data;
        console.log(response.data);

        const reporterUser = me;
        const reportedUser = banUser;

        const report = document.getElementById("report");

        const reportHTML = createReportHtml(
            reporterUser,
            reportedUser,
            banUserId,
        );

        report.innerHTML = reportHTML;

        document.getElementById("banApplication").style.display = "flex";
    } catch (error) {
        alert(error.response.data.message);
    }
}

function createReportHtml(reporterUser, reportedUser, banUserId) {
    return `
<span class="close" onclick="closeModal()">&times;</span>
<h2>신고 양식</h2>
<form>
<label for="reporterLabel">신고하는 사람:</label>
<span id="reporterUser">${reporterUser.name}</span><br />

<label for="reportedLabel">신고받는 사람:</label>
<span id="reportedUser">${reportedUser.name}</span><br />

<label for="reportContent">신고 내용:</label>
<textarea
    id="reportContent"
    name="reportContent"
    rows="4"
    required
></textarea><br />

<button type="button" onclick="submitReport(${reportedUser.id})">
    신고 제출
</button>
</form>
`;
}

function closeModal() {
    document.getElementById("banApplication").style.display = "none";
}

async function submitReport(banUserId) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const reportContent = document.getElementById("reportContent").value;

        const response = await axios.post(
            `/api/report/${banUserId}`,
            {
                reportContent,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        alert("신고가 완료되었습니다.");
        window.location.reload();
    } catch (error) {
        alert(error.response.data.message);
        window.location.reload();
    }
}
