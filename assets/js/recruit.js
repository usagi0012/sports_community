document.getElementById("feed").addEventListener("click", function (event) {
    event.preventDefault();
    feed();
});
const boardList = document.querySelector(".board-list");
function feed() {
    const accessToken = localStorage.getItem("accessToken");
    axios
        .get("/api/recruit", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const recruitList = response.data;

            // Clear existing content
            boardList.innerHTML = "";

            // Add new content
            const topContent = document.createElement("div");
            topContent.classList.add("top");
            topContent.innerHTML = `
                <div class="num">번호</div>
                <div class="category">카테고리</div>
                <div class="title">제목</div>
                <div class="region">지역</div>
                <div class="writer">작성자</div>
                <div class="gamedate">경기날짜</div>
                <div class="status">상태</div>
            `;
            boardList.appendChild(topContent);

            recruitList.forEach((recruits) => {
                const newContent = document.createElement("div");
                newContent.classList.add("item");
                newContent.innerHTML = `
                    <div class="num">${recruits.id}</div>
                    <div class="category">${recruits.rule}</div>
                    <div class="title" ><a href="recruit-detail.html?id=${
                        recruits.id
                    }">${recruits.title}</a></div>
                    <div class="region">${recruits.region}</div>
                    <div class="writer">${recruits.hostName}</div>
                    <div class="gamedate">${recruits.gamedate.slice(
                        "T",
                        10,
                    )}</div>
                    <div class="status">${recruits.status}</div>
                `;
                boardList.appendChild(newContent);
            });
        })
        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

document.getElementById("post-btn").addEventListener("click", function () {
    recruitPost();
});

function recruitPost() {
    window.location.href = "recruit-post.html";
}

function moveToCreateClub() {
    // 동아리 생성 페이지 이동 전 로그인이 되어 있는지 확인
    const authorized = localStorage.getItem("authorized");
    axios
        .post("/api/recruit", {
            headers: {
                Authorization: `Bearer ${authorized}`,
            },
        })
        .then(function (response) {
            alert(`${response.data.message}`);
            window.location.href = `/recruit-post.html`;
        })
        .catch(function (error) {
            console.log(error.response);
        });
}
