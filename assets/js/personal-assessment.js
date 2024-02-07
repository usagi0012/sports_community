const ratingInputFirst = document.querySelector(".rating1 input");
const ratingStarFirst = document.querySelector(".rating_star1");

const ratingInputTwo = document.querySelector(".rating2 input");
const ratingStarTwo = document.querySelector(".rating_star2");

// 별점 드래그 할 때
ratingInputFirst.addEventListener("input", () => {
    ratingInputFirst.value = Math.min(5, Math.max(0, ratingInputFirst.value));

    ratingStarFirst.style.width = `${(ratingInputFirst.value / 5) * 100}%`;
});

// 별점 드래그 할 때
ratingInputTwo.addEventListener("input", () => {
    ratingInputTwo.value = Math.min(5, Math.max(0, ratingInputTwo.value));

    ratingStarTwo.style.width = `${(ratingInputTwo.value / 5) * 100}%`;
});

function toggleButton(button) {
    button.classList.toggle("on");

    const value = button.classList.contains("on") ? 1 : 0;
    console.log(`버튼 값: ${value}`);

    if (value === 1) {
        button.style.background = "rgb(208, 72, 72)";
        button.style.color = "rgb(255,255,255)";
    } else {
        button.style.background = "rgb(243, 185, 95)";
        button.style.color = "rgb(0,0,0)";
    }
}

document
    .getElementById("submit-cancel-btn")
    .addEventListener("click", function () {
        closePersonal();
    });

async function getPersonalAssessment(matchId, playOtherUserId) {
    try {
        const ratingInputFirst = document.querySelector(".rating1 input");
        const ratingInputTwo = document.querySelector(".rating2 input");

        console.log(matchId, playOtherUserId);
        const personalityAmount = +ratingInputFirst.value;
        const abilityAmount = +ratingInputTwo.value;

        const token = localStorage.getItem("accessToken");

        await axios.put(
            `/api/assessment/personal/${+matchId}/${+playOtherUserId}`,
            {
                personalityAmount: personalityAmount,
                abilityAmount: abilityAmount,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log("개인평가 완료됨");
    } catch (error) {
        console.error(error);
        alert(error.response.data.message);
    }
}

async function getPersonalTag(matchId, playOtherUserId) {
    try {
        const token = localStorage.getItem("accessToken");

        const playerValues = {
            chisu: document.getElementById("post-btn1").classList.contains("on")
                ? 1
                : 0,
            curry: document.getElementById("post-btn2").classList.contains("on")
                ? 1
                : 0,
            daeman: document
                .getElementById("post-btn3")
                .classList.contains("on")
                ? 1
                : 0,
            irving: document
                .getElementById("post-btn4")
                .classList.contains("on")
                ? 1
                : 0,
            jorden: document
                .getElementById("post-btn5")
                .classList.contains("on")
                ? 1
                : 0,
            late: document.getElementById("post-btn6").classList.contains("on")
                ? 1
                : 0,
            mean: document.getElementById("post-btn7").classList.contains("on")
                ? 1
                : 0,
            run: document.getElementById("post-btn8").classList.contains("on")
                ? 1
                : 0,
            teawoong: document
                .getElementById("post-btn9")
                .classList.contains("on")
                ? 1
                : 0,
            thief: document
                .getElementById("post-btn10")
                .classList.contains("on")
                ? 1
                : 0,
            yakbird: document
                .getElementById("post-btn11")
                .classList.contains("on")
                ? 1
                : 0,
            zaza: document.getElementById("post-btn12").classList.contains("on")
                ? 1
                : 0,
        };
        await axios.put(
            `/api/assessment/personal/tag/${matchId}/${playOtherUserId}`,
            playerValues,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        console.log("태그평가 완료됨");
    } catch (error) {
        alert(error.response.data.message);
    }
}

// function returnPage() {
//     document
//         .getElementById("submit-btn")
//         .addEventListener("click", function () {
//             getPersonalAssessment();
//             getPersonalTag();
//         });
// }
// |

// function returnCancel() {
//     window.location.href = `/index.html`;
// }

function openPersonal() {
    var modal = document.getElementById("myPersonal");
    modal.style.display = "block";
}

function closePersonal() {
    var modal = document.getElementById("myPersonal");
    modal.style.display = "none";
}
