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
    const title = titleInput.value;
    const content = contentTextarea.value;
    const file = document.getElementById("inputFile").files[0];
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    axios
        .post(
            `/api/faq`,
            {
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
            returnPage();
        })
        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

function returnPage() {
    window.location.href = `/faq.html`;
}

function returnCencel() {
    window.location.href = `/faq.html`;
}
