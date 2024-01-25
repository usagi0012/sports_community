async function submitForm(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios
        .post("/api/auth/login", {
            email: email,
            password: password,
        })
        .then(function (response) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            console.log(response);
            window.location.href = "index.html";
        })
        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

async function toHome() {
    window.location.href = "index.html";
}

async function toForgotPassword() {
    window.location.href = "findPassword.html";
}
