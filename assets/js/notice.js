window.onload = function () {
    // notice();
    showCreateBtn();
};

const noticeBoardList = document.querySelector(".noticeBoardListContainer");

function notice() {
    noticeBoardList.innerHTML = "";
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get("/api/notice", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const noticeList = response.data.data;

            noticeList.forEach((notices) => {
                const newContent = document.createElement("div");
                newContent.classList.add("item");
                newContent.innerHTML = `
                                <div class="num">${notices.id}</div>
                                <div class="title"><a href="noticeDetail.html?id=${
                                    notices.id
                                }">${notices.title}</a></div>
                                <div class="writer">${notices.masterName}</div>
								<div class="createDate">${notices.createAt.slice(0, 10)}</div>
                                <div class="updateDate">${notices.updatedAt.slice(
                                    0,
                                    10,
                                )}</div>
                            `;
                noticeBoardList.appendChild(newContent);
            });
        });
}

function toNoticePost() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "noticePost.html";
    }
}

function showCreateBtn() {
    const createBtn = document.querySelector(".createBtn");

    const accessToken = localStorage.getItem("accessToken");
    axios
        .get("/api/notice/isAdmin", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            console.log("notice response", response);

            createBtn.style.display = "flex";
        })
        .catch(function (error) {
            console.log(error);
            createBtn.style.display = "none";
        });
}
