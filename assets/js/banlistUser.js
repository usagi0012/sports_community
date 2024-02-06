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
        console.log(response.data);
        const list = document.getElementById("list");
        list.innerHTML = "";

        response.data.forEach((item) => {
            const listHTML = createListHTML(item);
            list.innerHTML += listHTML;
        });
    } catch (error) {
        alert(error.response.data.message);
    }
}

function createListHTML(item) {
    return `
        <div id="${item.id}"  onclick="openModal()" style="margin-top: 10px">
            <div>유저 이름: <span>${item.banUserName}</span></div>
            <div>상태: <span>${item.progress}</span></div>
            <div>내용: <span>${item.reportContent}</span></div>
        </div>
    `;
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
