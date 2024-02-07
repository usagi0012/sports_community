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
        returnCancel();
    });

async function getClubAssessment(clubMatchId, myClubId) {
    const ratingInputFirst = document.querySelector(".rating1 input");
    const ratingInputTwo = document.querySelector(".rating2 input");

    const personalityAmount = +ratingInputFirst.value;
    const abilityAmount = +ratingInputTwo.value;

    const token = localStorage.getItem("accessToken");
    axios.put(
        `/api/assessment/club/${+clubMatchId}/${+myClubId}`,
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
    console
        .log("평가완료")
        .then(function (response) {
            console.log(response.data.message);
        })
        .catch(function (error) {
            console.log(error);
            alert(error.response.data.message);
        });
}

async function getClubTag(clubMatchId, myClubId) {
    const token = localStorage.getItem("accessToken");
    const playerValues = {
        buksan: document.getElementById("post-btn1").classList.contains("on")
            ? 1
            : 0,
        sanantonio: document
            .getElementById("post-btn2")
            .classList.contains("on")
            ? 1
            : 0,
        gentle: document.getElementById("post-btn3").classList.contains("on")
            ? 1
            : 0,
        manner: document.getElementById("post-btn4").classList.contains("on")
            ? 1
            : 0,
        lakers: document.getElementById("post-btn5").classList.contains("on")
            ? 1
            : 0,
        oneman: document.getElementById("post-btn6").classList.contains("on")
            ? 1
            : 0,
        goldenstate: document
            .getElementById("post-btn7")
            .classList.contains("on")
            ? 1
            : 0,
        notbed: document.getElementById("post-btn8").classList.contains("on")
            ? 1
            : 0,
        bed: document.getElementById("post-btn9").classList.contains("on")
            ? 1
            : 0,
        tough: document.getElementById("post-btn10").classList.contains("on")
            ? 1
            : 0,
        fighter: document.getElementById("post-btn11").classList.contains("on")
            ? 1
            : 0,
        late: document.getElementById("post-btn12").classList.contains("on")
            ? 1
            : 0,
    };

    axios.put(
        `/api/assessment/club/tag/${clubMatchId}/${myClubId}`,
        playerValues,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    console
        .log("태그평가완료")

        .then(function (response) {
            console.log(response.data.message);
        })
        .catch(function (error) {
            console.log(error);
            alert(error.response.data.message);
        });
}

// function returnPage() {
//     document
//         .getElementById("submit-btn")
//         .addEventListener("click", function () {
//             getClubAssessment(1, 3);
//             getClubTag(1, 3);
//         });
// }

// function returnCancel() {
//     window.location.reload();
// // }

// function openclubAssessment() {
//     var clubAssessmentModal = document.getElementById("clubAssessment");
//     clubAssessmentModal.style.display = "block";
// }

// closeModal 함수 정의
function closeclubAssessment() {
    var clubAssessmentModal = document.getElementById("clubAssessment");
    clubAssessmentModal.style.display = "none";
}
