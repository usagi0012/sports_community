window.onload = function () {
    loadHeader();
    loadFooter();
};

const titleInput = document.querySelector("#inputTitle");
const contentTextarea = document.querySelector("#input-content");

document.getElementById("register-btn").addEventListener("click", function () {
    submitForm();
});

document
    .getElementById("register-cancel-btn")
    .addEventListener("click", function () {
        returnCencel();
    });

function submitForm() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    let noticeId = urlParams.get("id");

    const title = titleInput.value;
    const content = contentTextarea.value;
    const file = document.getElementById("inputFile").files[0];
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    axios
        .put(
            `/api/notices/${noticeId}`,
            {
                id: noticeId,
                masterId: userId,
                title: title,
                file: file,
                description: content,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            },
        )
        .then(function (response) {
            alert(response.data.message);
            window.location.href = `/noticeDetail.html?id=${noticeId}`;
        })
        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

function returnCencel() {
    const urlParams = new URLSearchParams(window.location.search);
    let noticeId = urlParams.get("id");
    window.location.href = `/noticeDetail.html?id=${noticeId}`;
}
