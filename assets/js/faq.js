window.onload = function () {
    faq();
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
            console.log(faqList);
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
