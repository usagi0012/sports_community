window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    let noticeId = urlParams.get("id");
    getNoticeDetail(noticeId);
};

const noticeBoardDetail = document.querySelector(".detailContainer");

function getNoticeDetail(noticeId) {
    const accessToken = localStorage.getItem("accessToken");
    axios
        .get(`/api/notice/${noticeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const noticeDetail = response.data.data;
            noticeBoardDetail.innerHTML = "";

            // Add new content
            const topContent = document.createElement("div");
            topContent.classList.add("top");
            topContent.innerHTML = `
                <label class="title">${noticeDetail.title}</label>
                <div class="info">
                <div class="firstRow">
                    <dl class="hostName">
                        <dt>작성자</dt>
                        <dd>${noticeDetail.masterName}</dd>
                    </dl>
                </div>
                <div class="secondRow">
                    <dl class="createDate">
                        <dt>작성일</dt>
                        <dd>${noticeDetail.createAt.slice(0, 10)}</dd>
                    </dl>
					<dl class="createDate">
                        <dt>작성일</dt>
                        <dd>${noticeDetail.updatedAt.slice(0, 10)}</dd>
                    </dl>
                </div>
                </div>
                <div class="cont">${noticeDetail.description}</div>
                <img src="${noticeDetail.image}" alt="Uploaded Image">
            `;
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
        .delete(`api/notice/${noticeId}`, {
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
