window.onload = function () {
    loadHeader();
    loadFooter();
    loadUserMenu();
    displayList();
};

//본인이 신청한 벤 조회하기
async function displayList() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        console.log(accessToken);
        const response = await axios.get("/api/report/banlist/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(response.data);
        const list = document.getElementById("list");
        list.innerHTML = "";
        response.data.forEach((item) => {
            const listHTML = createListHTML(item);
            const buttonHTML = createButtonHTML(item);
            list.innerHTML += listHTML + buttonHTML;
        });
    } catch (error) {
        alert(error.response.data.message);
    }
}

function createListHTML(item) {
    return `
        <div class="banDiv" id="${item.id}">
            <div>유저 이름: <span>${item.banUserName}</span></div>
            <div>상태: <span>${item.progress}</span></div>
            <div>내용: <span>${item.reportContent}</span></div>
            
        </div>
    `;
}

function createButtonHTML(item) {
    if (item.progress === "신고 완료") {
        return "";
    }

    return `<button onclick="confirm(${item.id})">확인</button>`;
}

async function confirm(reportId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        console.log(accessToken);
        const response = await axios.delete(
            `/api/report/me/confirm/${reportId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        alert("감사합니다.");
        window.location.reload();
    } catch (error) {
        alert(error.response.data.message);
    }
}

function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "flex";
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
