window.onload = function () {
    loadHeader();
    loadFooter();
    const urlParams = new URLSearchParams(window.location.search);
    let recruitId = urlParams.get("id");
    getRecruitDetail(recruitId);

    document
        .getElementById("modalOpenButton")
        .addEventListener("click", function () {
            openApplyingModal();
        });

    function openApplyingModal() {
        document.getElementById("applyModal").classList.remove("hidden");
    }

    function closeApplyingModal() {
        document.getElementById("applyModal").classList.add("hidden");
    }

    document
        .getElementById("submit-application")
        .addEventListener("click", function () {
            submitApplication(recruitId);
        });

    document
        .getElementById("close-modal")
        .addEventListener("click", function () {
            closeApplyingModal();
        });
};

const feedBoardDetail = document.querySelector(".detailContainer");

function getRecruitDetail(recruitId) {
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get(`/api/recruit/${recruitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const recruitDetail = response.data;
            // Clear existing content
            feedBoardDetail.innerHTML = "";

            // Add new content
            const topContent = document.createElement("div");
            topContent.classList.add("top");
            topContent.innerHTML = `
                <label class="title">${recruitDetail.title}</label>
                <div class="info">
                <div class="firstRow">
                    <dl class="hostName">
                        <dt>작성자</dt>
                        <dd>${recruitDetail.hostName}</dd>
                    </dl>
                    <dl class="region">
                        <dt>지역</dt>
                        <dd>${recruitDetail.region}</dd>
                    </dl>
                    <dl class="status">
                    <dt>상태</dt>
                    <dd>${recruitDetail.status}</dd>
                </dl>
                <dl class="gps">
                <dd id="gpsBtn">${recruitDetail.gps}</dd>
            </dl>
                </div>
                <div class="secondRow">
                    <dl class="rule">
                        <dt>rule</dt>
                        <dd>${recruitDetail.rule}</dd>
                    </dl>
                    <dl class="member">
                        <dt>인원</dt>
                        <dd>${recruitDetail.totalmember} / ${
                            recruitDetail.basictotalmember
                        }</dd>
                    </dl>
                    <dl class="gamedate">
                    <dt>경기 예정 시간</dt>
                    <dd>${
                        recruitDetail.gamedate.slice("T", 10).padEnd(12, " ") +
                        recruitDetail.gamedate.slice(11, 16)
                    } - ${
                        recruitDetail.endtime.slice("T", 10).padEnd(12, " ") +
                        recruitDetail.endtime.slice(11, 16)
                    }</dd>
                </dl>
                </div>
                </div>
                <div class="cont">${recruitDetail.content}</div>
            `;
            feedBoardDetail.appendChild(topContent);
        })
        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}


function submitApplication(recruitId) {
    const inputMessage = document.getElementById("description1");
    const message = inputMessage.value;

    const accessToken = localStorage.getItem("accessToken");
    // 신청을 서버에 전송하는 Axios 코드를 추가합니다.
    axios
        .post(
            `/api/match/post/${recruitId}`,
            {
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )
        .then(function (response) {
            // 성공적으로 처리된 경우 추가적인 처리를 할 수 있습니다.
            console.log(response);
            alert("신청 완료");
            document
                .getElementById("applyModal")
                .setAttribute("hidden", "true");
        })
        .catch(function (error) {
            console.error(error.response.data);
            alert(error.response.data.message);
        });
}
