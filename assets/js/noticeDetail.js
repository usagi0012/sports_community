window.onload = function () {
    loadHeader();
    loadFooter();
    loadNoticeMenu();
    showAndHideBtn();
    const urlParams = new URLSearchParams(window.location.search);
    let noticeId = urlParams.get("id");
    getNoticeDetail(noticeId);
};

const noticeBoardDetail = document.querySelector(".detailContainer");

function getNoticeDetail(noticeId) {
    const accessToken = localStorage.getItem("accessToken");
    axios
        .get(`/api/notices/${noticeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const noticeDetail = response.data.data;
            noticeBoardDetail.innerHTML = "";

            const topContent = document.createElement("div");
            topContent.classList.add("top");
            topContent.innerHTML = `
                <div class="info">
                <label class="title">${noticeDetail.title}</label>
                    <div class="hostName">
                        <dd>${noticeDetail.masterName}</dd>
                    </div>
                    <div class="createDate">
                        <dd>${noticeDetail.createAt.slice(0, 10)}</dd>
                    </div>
                </div>
                <div class="cont">${noticeDetail.description}</div>
            `;

            // Check if image is available before appending it
            if (noticeDetail.image) {
                const imageElement = document.createElement("img");
                imageElement.src = noticeDetail.image;
                imageElement.alt = "Uploaded Image";
                topContent.appendChild(imageElement);
            }

            noticeBoardDetail.appendChild(topContent);
        })

        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

function moveToUpdatePage() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    let noticeId = urlParams.get("id");

    window.location.href = `noticeUpdate.html?id=${noticeId}`;
}

function deletePage() {
    let result = confirm("공지사항을 정말로 삭제하시겠습니까?");
    if (result) {
        deleteCheck();
    } else {
        alert("공지사항 삭제를 취소했습니다.");
    }
}

function deleteCheck() {
    const urlParams = new URLSearchParams(window.location.search);
    let noticeId = urlParams.get("id");

    const token = localStorage.getItem("accessToken");

    axios
        .delete(`api/notices/${noticeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log(response);
            alert(`${response.data.message}`);
            window.location.href = "notice.html";
        })
        .catch(function (error) {
            console.log(error);
            alert("공지사항 삭제에 실패했습니다.");
        });
}

function showAndHideBtn() {
    const updateBtn = document.querySelector(".updateBtn");
    const deleteBtn = document.querySelector(".deleteBtn");

    const accessToken = localStorage.getItem("accessToken");
    axios
        .get("/api/notice/isAdmin", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            console.log("isAdmin response", response);

            updateBtn.style.display = "flex";
            deleteBtn.style.display = "flex";
        })
        .catch(function (error) {
            console.log(error);
            updateBtn.style.display = "none";
            deleteBtn.style.display = "none";
        });
}
