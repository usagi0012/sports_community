window.onload = function () {
    loadHeader();
    feed();
    loadFooter();
};

const boardList = document.querySelector(".boardListContainer");
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
            recruitList.forEach((recruits) => {
                const newContent = document.createElement("div");
                console.log(recruits);
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
            alert("로그인 후 이용 가능합니다.");
            window.location.href = "index.html";
        });
}

function toRecruitPost() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인 후 이용 가능합니다.");
    } else {
        window.location.href = "recruit-post.html";
    }
}
