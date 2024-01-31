window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    let recruitId = urlParams.get("id");

    getRecruitDetail(recruitId);

    const recruitDeleteButton = document.getElementById("recruit-delete");
    if (recruitDeleteButton) {
        recruitDeleteButton.addEventListener("click", function () {
            recruitDelete(recruitId);
        });
    }

    document
        .getElementById("modalOpenButton")
        .addEventListener("click", function () {
            openApplyingModal();
        });

    function openApplyingModal() {
        document.getElementById("applyModal").removeAttribute("hidden");
    }

    function closeApplyingModal() {
        document.getElementById("applyModal").setAttribute("hidden", "true");
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

const feedBoardDetail = document.querySelector(".board-detail");

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
                <div class="title">${recruitDetail.title}</div>
                <div class="info">
                    <dl>
                        <dt>번호</dt>
                        <dd>${recruitDetail.id}</dd>
                    </dl>
                    <dl>
                        <dt>호스트</dt>
                        <dd>${recruitDetail.hostName}</dd>
                    </dl>
                    <dl>
                        <dt>지역</dt>
                        <dd>${recruitDetail.region}</dd>
                    </dl>
                    <dl>
                        <dt>gps</dt>
                        <dd>${recruitDetail.gps}</dd>
                    </dl>
                    <dl>
                        <dt>경기날짜</dt>
                        <dd>${recruitDetail.gamedate.slice("T", 10)}</dd>
                    </dl>
                    <dl>
                        <dt>경기마감</dt>
                        <dd>${recruitDetail.endtime.slice("T", 10)}</dd>
                    </dl>
                    <dl>
                        <dt>playtime</dt>
                        <dd>${recruitDetail.runtime}</dd>
                    </dl>
                    <dl>
                        <dt>rule</dt>
                        <dd>${recruitDetail.rule}</dd>
                    </dl>
                    <dl>
                        <dt>인원</dt>
                        <dd>${recruitDetail.totalmember}</dd>
                    </dl>
                    <dl>
                        <dt>전체인원</dt>
                        <dd>${recruitDetail.basictotalmember}</dd>
                    </dl>
                    <dl>
                        <dt>상태</dt>
                        <dd>${recruitDetail.status}</dd>
                    </dl>
                </div>
                <div class="cont">${recruitDetail.content}<br></div>
            `;
            feedBoardDetail.appendChild(topContent);
        })
        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

document
    .getElementById("recruit-delete")
    .addEventListener("click", function () {
        recruitDelete();
    });

function recruitDelete(recruitId) {
    const accessToken = localStorage.getItem("accessToken");

    axios
        .delete(`api/recruit/my/post/${recruitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            alert("삭제을 완료했습니다.");
            window.location.reload();
        })
        .catch(function (error) {
            console.log(error.response.data);

            /* alert(error.response.data.message); */
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
            alert(`${response.data.message}`);
            document
                .getElementById("applyModal")
                .setAttribute("hidden", "true");
        })
        .catch(function (error) {
            console.error(error.response.data);
            alert("신청을 처리하는 도중 오류가 발생했습니다.");
        });
}
