let countdown;

document
    .getElementById("signupBtn")
    .addEventListener("click", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;

        resendVerificationEmail(email);
    });

async function resendVerificationEmail(email) {
    try {
        const response = await axios.post(
            "/api/auth/resend-verification-email",
            {
                email,
            },
        );

        alert("인증 메일이 재전송되었습니다.");

        // 카운트다운 시작
        startCountdownTimer(180); // 3분을 초로 표시
    } catch (error) {
        // 에러 처리
        console.error(error);
        alert("인증 메일 재전송에 실패했습니다.");
    }
}

function startCountdownTimer(durationInSeconds) {
    const timerElement = document.getElementById("countdownTimer");
    timerElement.style.display = "block";

    let remainingTime = durationInSeconds;

    countdown = setInterval(function () {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        timerElement.innerHTML = `${minutes}:${seconds}`;

        if (remainingTime === 0) {
            clearInterval(countdown);
            timerElement.innerHTML = "시간 초과";
            timerElement.style.display = "none";
        } else {
            remainingTime--;
        }
    }, 1000);
}
