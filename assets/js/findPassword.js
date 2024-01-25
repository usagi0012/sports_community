const { all } = require("axios");

async function submitForm(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    axios
        .post("/api/auth/resetPassword", {
            email: email,
        })
        .then(function (response) {
            alert(response.data.message);
            window.location.href = "login.html";
        })
        .catch(function (error) {
            console.log(error);
            alert(error.response.data.message);
        });
}
