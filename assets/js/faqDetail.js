window.onload = function () {
    loadHeader();
    loadFooter();
    loadNoticeMenu();
    showAndHideBtn();
    const urlParams = new URLSearchParams(window.location.search);
    let faqId = urlParams.get("id");
    console.log("야 너 왜 안나와?dddddddddd", userId);
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
            `;

            // Check if image is available before appending it
            if (faqDetail.image) {
                const imageElement = document.createElement("img");
                imageElement.src = faqDetail.image;
                imageElement.alt = "Uploaded Image";
                topContent.appendChild(imageElement);
            }

            faqBoardDetail.appendChild(topContent);
        })

        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
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

function moveToUpdatePage() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
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
            console.log(response);
            alert(`${response.data.message}`);
            window.location.href = "faq.html";
        })
        .catch(function (error) {
            console.log(error);
            alert("FAQ 삭제에 실패했습니다.");
        });
}
