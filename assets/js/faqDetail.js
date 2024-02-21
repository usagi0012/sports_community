window.onload = function () {
    loadHeader();
    loadFooter();
    loadNoticeMenu();
    const urlParams = new URLSearchParams(window.location.search);
    let faqId = urlParams.get("id");
    getFaqDetail(faqId);
};

const faqBoardDetail = document.querySelector(".detailContainer");

function getFaqDetail(faqId) {
    const accessToken = localStorage.getItem("accessToken");
    axios
        .get(`/api/faq/${faqId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const faqDetail = response.data.data;
            faqBoardDetail.innerHTML = "";
            const topContent = document.createElement("div");
            topContent.classList.add("top");
            topContent.innerHTML = `
                <div class="info">
                <label class="title">${faqDetail.title}</label>
                    <div class="hostName">
                        ${faqDetail.masterName}
                    </div>
                    <div class="createDate">
                        ${faqDetail.createAt.slice(0, 10)}
                    </div>
                </div>
                <div class="cont">${faqDetail.description}</div>
                <img src="${faqDetail.image}" alt="Uploaded Image">
            `;
            faqBoardDetail.appendChild(topContent);
        })

        .catch(function (error) {
            alert(error.response.data.message);
        });
}

function moveToUpdatePage() {
    const urlParams = new URLSearchParams(window.location.search);
    let faqId = urlParams.get("id");

    window.location.href = `faqUpdate.html?id=${faqId}`;
}

function deletePage() {
    let result = confirm("FAQ를 정말로 삭제하시겠습니까?");
    if (result) {
        deleteCheck();
    } else {
        alert("FAQ 삭제를 취소했습니다.");
    }
}

function deleteCheck() {
    const urlParams = new URLSearchParams(window.location.search);
    let faqId = urlParams.get("id");

    const token = localStorage.getItem("accessToken");

    axios
        .delete(`api/faq/${faqId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            alert(`${response.data.message}`);
            window.location.href = "faq.html";
        })
        .catch(function (error) {
            alert("FAQ 삭제에 실패했습니다.");
        });
}
