window.onload = function () {
    loadHeader();
    loadFooter();
};

const titleInput = document.querySelector("#inputTitle");
const regionSelect = document.getElementById("regionSelect");
const gpsInput = document.querySelector("#input-gps");
const gamedateInput = document.querySelector("#input-gamedate");
const endtimeInput = document.querySelector("#input-runtime-hours");
const ruleSelect = document.getElementById("ruleSelect");
const totalmemberInput = document.querySelector("#input-totalmember");
const contentTextarea = document.querySelector("#input-content");

document.getElementById("register-btn").addEventListener("click", function () {
    submitForm();
});

document
    .getElementById("register-cancel-btn")
    .addEventListener("click", function () {
        returnCencel();
    });

async function submitForm() {
    const title = titleInput.value;
    const region = regionSelect.value;
    const gamedate = gamedateInput.value;
    const endtime = endtimeInput.value;
    const rule = ruleSelect.value;
    const totalmember = totalmemberInput.value;
    const content = contentTextarea.value;
    const gps = gpsInput.value;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    const validatedRule = validateRule(rule);

    if (!validatedRule) {
        alert("올바른 값을 선택하세요.");
        return;
    }

    try {
        const response = await axios.post(
            `/api/recruit`,
            {
                userId: userId,
                title: title,
                region: region,
                gps: gps,
                gamedate: gamedate,
                endtime: endtime,
                rule: validatedRule,
                totalmember: totalmember,
                content: content,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log(response);
        alert("모집글이 등록되었습니다.");
        returnPage();
    } catch (error) {
        console.log(error.response.data);
        alert(error.response.data.message);
    }
}

function returnPage() {
    window.location.href = `/recruit.html`;
}

function returnCencel() {
    window.location.href = `/recruit.html`;
}

// 사용자가 선택한 값이 Enum에 속하는지 확인하고 Enum 값으로 변환하는 함수
// function validateRegion(value) {
//     if (value === "Region1" || value === "Region2") {
//         return value;
//     }
//     return null;
// }

function validateRule(value) {
    if (value === "3대3" || value === "4대4" || value === "5대5") {
        return value;
    }
    return null;
}
