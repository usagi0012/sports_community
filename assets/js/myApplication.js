window.onload = function () {
    loadHeader();
    loadFooter();
    getMyApplication();
};

function getMyApplication() {
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get("/api/applying-club/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const mainContainer = document.querySelector(".mainContainer");
            if (response.data.error == "지원서가 존재하지 않습니다.") {
                return (mainContainer.innerHTML = `동아리 지원 내역이 없습니다.`);
            } else {
                const clubApplication = document.createElement("div");
                clubApplication.className = "myApplicationCard";
                mainContainer.appendChild(clubApplication);

                // 동아리 id가 아니라 동아리 번호로 수정하기
                const clubName = document.createElement("div");
                clubName.className = "clubId";
                clubName.innerHTML = `이름 : ${response.data.data.clubName} `;
                clubApplication.appendChild(clubName);

                const message = document.createElement("div");
                message.className = "message";
                message.innerHTML = `신청 메세지 : ${response.data.data.message}`;
                clubApplication.appendChild(message);

                const status = document.createElement("div");
                status.className = "status";
                status.innerHTML = `상태 : ${response.data.data.status}`;
                clubApplication.appendChild(status);

                const deleteApplicationBtn = document.createElement("button");
                deleteApplicationBtn.className = "deleteApplicationBtn";
                deleteApplicationBtn.innerHTML = "신청 취소";
                clubApplication.appendChild(deleteApplicationBtn);

                deleteApplicationBtn.addEventListener(
                    "click",
                    confirmDeleteApplcation,
                );
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function openModifyModal() {
    const modifyModal = document.querySelector("#modal");
    modifyModal.style.display = "flex";
}

function deleteApplication() {
    const accessToken = localStorage.getItem("accessToken");

    axios
        .delete(`/api/applying-club/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            alert("삭제가 완료되었습니다.");
        })
        .catch(function (error) {
            alert("삭제에 실패했습니다.");
        });
}

function confirmDeleteApplcation() {
    let result = confirm("신청서를 정말로 삭제하시겠습니까?");
    if (result) {
        deleteApplication();
    } else {
        alert("신청서 삭제를 취소했습니다.");
    }
}
