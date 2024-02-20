window.onload = function () {
    loadHeader();
    loadFooter();
    loadNoticeMenu();
    faq();
    showCreateBtn();
};

const faqBoardList = document.querySelector(".faqBoardListContainer");

function faq() {
    faqBoardList.innerHTML = "";
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get("/api/faq", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const faqList = response.data.data;

            faqList.forEach((faqs) => {
                const newContent = document.createElement("div");
                newContent.classList.add("item");
                newContent.innerHTML = `
                                <div class="num">${faqs.id}</div>
                                <div class="title"><a href="faqDetail.html?id=${
                                    faqs.id
                                }">${faqs.title}</a></div>
                                <div class="writer">${faqs.masterName}</div>
								<div class="createDate">${faqs.createAt.slice(0, 10)}</div>
                                <div class="updateDate">${faqs.updatedAt.slice(
                                    0,
                                    10,
                                )}</div>
                            `;
                faqBoardList.appendChild(newContent);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function toFaqPost() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "faqPost.html";
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
