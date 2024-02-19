window.onload = function () {
    loadHeader();
    loadFooter();
    loadNoticeMenu();
    qna();
    showCreateBtn();
};

const qnaBoardList = document.querySelector(".qnaBoardListContainer");

function qna() {
    qnaBoardList.innerHTML = "";
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get("/api/qna", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const qnaList = response.data.data;
            qnaList.forEach((qnas) => {
                const newContent = document.createElement("div");
                newContent.classList.add("item");
                newContent.innerHTML = `
                                <div class="num">${qnas.id}</div>
                                <div class="title"><a href="qnaDetail.html?id=${
                                    qnas.id
                                }&token=${accessToken}">${qnas.title}</a></div>
                                <div class="writer">${qnas.userName}</div>
								<div class="createDate">${qnas.createAt.slice(0, 10)}</div>
                                <div class="updateDate">${qnas.updatedAt.slice(
                                    0,
                                    10,
                                )}</div>
                            `;
                qnaBoardList.appendChild(newContent);
            });
        });
}

function toQnaPost() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "qnaPost.html";
    }
}

function showCreateBtn() {
    const createBtn = document.querySelector(".createBtn");

    const accessToken = localStorage.getItem("accessToken");
    axios
        .get("/api/qna/isUser", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            createBtn.style.display = "flex";
        })
        .catch(function (error) {
            createBtn.style.display = "none";
        });
}
