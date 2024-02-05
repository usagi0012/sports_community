const init = {
    monthArr: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ],
    date: new Date(),
    today: new Date(),
    setYearMonth: function (selectedDate) {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        $(".calendar-yearmonth__col").text(`${init.monthArr[month]}, ${year}`);
    },
    setDates: function (selectedDate) {
        const lastDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0,
        ).getDate();
        const firstDay = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1,
        ).getDay();
        const firstWeek = 7 - firstDay;

        let day = 0;
        let week = 1;
        let innerHtml = '<div class="calendar-date__row">';

        for (let j = 1; j <= 7 - firstWeek; j++) {
            innerHtml = innerHtml + "<div class='calendar-date__col'></div>";
            day !== 6 ? day++ : (day = 0);
        }

        for (let i = 1; i <= lastDate; i++) {
            if (week === 1) {
                innerHtml =
                    innerHtml + `<div class='calendar-date__col'>${i}</div>`;
                if (day === 6) {
                    innerHtml =
                        innerHtml + "</div><div class='calendar-date__row'>";
                    day = 0;
                    week++;
                } else {
                    day++;
                }
            } else {
                innerHtml =
                    innerHtml + `<div class='calendar-date__col'>${i}</div>`;
                if (day === 6) {
                    innerHtml =
                        innerHtml + "</div><div class='calendar-date__row'>";
                    day = 0;
                    week++;
                } else {
                    day++;
                }
            }
        }

        if (day !== 0) {
            while (day !== 0) {
                innerHtml =
                    innerHtml + "<div class='calendar-date__col'></div>";
                day !== 6 ? day++ : (day = 0);
            }
            innerHtml = innerHtml + "</div>";
        }

        $(".calendar-date").html(innerHtml);
    },
    drawCalendar: function () {
        const date = init.date;
        init.setYearMonth(date);
        init.setDates(date);
        if (
            date.getMonth() === init.today.getMonth() &&
            date.getFullYear() === init.today.getFullYear()
        ) {
            init.addClassToday(init.findToday(init.today));
        }
    },
    findToday: function (date) {
        const thisDay = date;
        const firstDay = new Date(
            thisDay.getFullYear(),
            thisDay.getMonth(),
            1,
        ).getDay();
        const week = Math.ceil((thisDay.getDate() + firstDay) / 7);
        let day = (thisDay.getDate() % 7) + firstDay;

        if (day > 7) {
            day = day - 7;
        }

        const today = $(
            `.calendar-date>div:nth-child(${week})>div:nth-child(${day})`,
        );
        return today;
    },
    addClassToday: function (today) {
        today.addClass("calendar-date__today");
    },
};

function prevMonthDraw() {
    const thisMonth = init.date.getMonth();
    const thisYear = init.date.getFullYear();

    init.date = new Date(thisYear, thisMonth - 1, 1);
    init.drawCalendar();
}

function resetModalInputs() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("color").value = "";
    // 필요한 경우 다른 입력 필드들도 초기화
}

//모달열기
async function openModal(date) {
    const createModal = document.getElementById("createCalendarModal");

    resetModalInputs();

    createModal.style.display = "block";
    document.getElementById("date").value = date
        ? date.toISOString().split("T")[0]
        : "";
}

// 생성 모달 닫기 함수
function closeCreateModal() {
    const modal = document.getElementById("createCalendarModal");
    modal.style.display = "none";
}

// 수정 모달 닫기 함수
function closeUpdateModal() {
    const modal = document.getElementById("updateCalendarModal");
    modal.style.display = "none";
}

function closeTitleModal() {
    const modal = document.getElementById("titleModal");
    modal.style.display = "none";
}

// 닫기 버튼 클릭 이벤트 처리
document
    .getElementById("closeCreateModalBtn")
    .addEventListener("click", closeCreateModal);
document
    .getElementById("closeUpdateModalBtn")
    .addEventListener("click", closeUpdateModal);

document
    .getElementById("closeTitleModalBtn")
    .addEventListener("click", closeTitleModal);

// 모달이 외부를 클릭하면 닫기
window.onclick = function (event) {
    const modal = document.getElementById("createCalendarModal");
    if (event.target === modal) {
        closeModal();
    }
};

// 폼 제출 시 이벤트 처리
document
    .getElementById("calendarForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const color = document.getElementById("color").value;

        // 여기에서 API 호출을 통해 백엔드에 일정 생성 요청을 보냄
        createCalendar(title, description, color, selectedDate);
        closeModal();
    });

function closeModal() {
    document.getElementById("createCalendarModal").style.display = "none";
}
let selectedDate = null;

$(".calendar-date").on("click", ".calendar-date__col", function () {
    // 클릭한 날짜 데이터 콘솔 출력
    const clickedDate = $(this).text();
    console.log("클릭한 날짜:", clickedDate);

    // 클릭한 날짜의 전체 날짜 생성
    const clickedFullDate = new Date(
        init.date.getFullYear(),
        init.date.getMonth(),
        parseInt(clickedDate, 10) + 1,
    );

    console.log("클릭한 날짜 전체 날짜", clickedFullDate);

    // 클릭한 날짜로 Date 객체 생성
    selectedDate = new Date(
        clickedFullDate.getFullYear(),
        clickedFullDate.getMonth(),
        clickedFullDate.getDate(),
        0,
        0,
        0,
        0,
    );

    console.log("선택한 날짜", selectedDate);

    // 클릭한 날짜를 기반으로 서버에 요청 보내기
    loadEventForSelectedDate(selectedDate);

    document.getElementById("date").value = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : "";
});

let currentEvent = null; // 전역 변수로 현재 이벤트를 저장할 변수

// 수정 모달창 열기 함수
function openUpdateModal(event) {
    console.log("event 안에 내용", event);

    // 수정 모달창 열기
    document.getElementById("updateCalendarModal").style.display = "block";
    document.getElementById("updateTitle").value = event.title;
    document.getElementById("updateDescription").value = event.description;
    document.getElementById("updateColor").value = event.color;

    // 현재 이벤트를 전역 변수에 저장
    currentEvent = event;

    // 수정 모달창에서 existDate를 반환 (필요한 경우에만 반환)
    console.log("event 반환하기 전", event);
}

async function loadEventForSelectedDate(selectedDate) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const user = await axios.get(`/api/user/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const userId = user.data.id;

        console.log("선택한날짜의 함수호출", selectedDate);
        // selectedDate를 이용하여 axios.get 호출
        const response = await axios.get(`/api/user/me/calender/date`, {
            params: {
                date: selectedDate.toISOString().split("T")[0],
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("선택한 날짜의 response", response.data);

        if (response.data.message === "해당 날짜에 등록된 일정이 없습니다.") {
            console.log("일정을 등록해주세요");
            // 일정이 없는 경우, 빈 목록과 "일정 생성" 버튼을 보여줌
            openTitleModal([]);
        } else {
            const existDate = response.data.data.calenders;

            if (existDate) {
                // 일정이 이미 존재하는 경우 수정 모달 열기
                console.log(existDate);

                openTitleModal(existDate); // 해당 선택된 날짜를 전달
            } else {
                return openModal(selectedDate); // 데이터가 없으면 생성 모달 열기
            }
        }
    } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        console.error(
            console.log(error),
            "Error loading events for selected date:",
            error.response ? error.response.data.message : error.message,
        );
        return null;
    }
}

function openTitleModal(existDate) {
    const titleModal = document.getElementById("titleModal");
    const titleModalTitle = document.getElementById("titleModalTitle");
    const titleModalList = document.getElementById("titleModalList");

    // titleModalTitle에는 첫 번째 일정의 title을 설정
    titleModalTitle.textContent = "할 일";

    // 일정 리스트 업데이트
    titleModalList.innerHTML = "";

    // order 프로퍼티를 기준으로 오름차순으로 정렬
    existDate.sort((a, b) => a.order - b.order);

    existDate.forEach((event) => {
        const listItem = document.createElement("li");
        listItem.textContent = event.title;

        // 각각의 일정에 대해 클릭 이벤트 추가
        listItem.addEventListener("click", () => {
            console.log("openUpdateModal로 들어가기");
            openUpdateModal(event);
            titleModal.style.display = "none";
        });

        titleModalList.appendChild(listItem);
    });

    // 생성 버튼에 클릭 이벤트 추가
    const createCalendarBtn = document.getElementById("createCalendarBtn");
    createCalendarBtn.addEventListener("click", function (event) {
        openModal(existDate.length > 0 ? existDate[0].date : selectedDate);
        titleModal.style.display = "none";
    });

    titleModal.style.display = "block";
}

document
    .getElementById("updateCalendarForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        // 여기에서 API 호출을 통해 백엔드에 일정 수정 요청을 보냄
        const updatedTitle = document.getElementById("updateTitle").value;
        const updatedDescription =
            document.getElementById("updateDescription").value;
        const updatedColor = document.getElementById("updateColor").value;

        // 수정된 일정 정보를 가져와서 프론트엔드에서 화면을 갱신할 수 있음
        const success = await updateCalendar(
            currentEvent.id,
            updatedTitle,
            updatedDescription,
            updatedColor,
        );

        if (success) {
            alert("수정 완료");
            closeUpdateModal();
        } else {
            // 수정에 실패한 경우에 대한 처리
            console.error("Failed to update calendar event.");
        }
    });

async function createCalendar(title, description, color, selectedDate) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        // userId를 이용하여 axios.post 호출
        const response = await axios.post(
            `/api/user/me/calender`,
            {
                title,
                date: selectedDate,
                description,
                color,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response.data);
        alert("생성 완료");
        // 여기에서 성공 시 프론트엔드에서 할 작업을 수행 (예: 새로고침 없이 화면 갱신)
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        console.error(
            "Error creating calendar:",
            error.response ? error.response.data.message : error.message,
        );
    }
}

// updateCalendar 함수 정의
async function updateCalendar(calenderId, title, description, color) {
    try {
        const accessToken = localStorage.getItem("accessToken");
        console.log("여기", calenderId);

        // userId 및 calenderId를 이용하여 axios.put 호출
        const response = await axios.put(
            `/api/user/me/calender/${calenderId}`,
            {
                calenderId,
                title,
                description,
                color,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response);
        // 수정이 성공하면 true 반환
        return true;
    } catch (error) {
        console.log("수정실패", error);
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "/login.html";
        }
        console.error(
            "Error updating calendar event:",
            error.response ? error.response.data.message : error.message,
        );
        // 수정이 실패하면 false 반환
        return false;
    }
}

async function deleteCalendar(calenderId) {
    try {
        const accessToken = localStorage.getItem("accessToken");

        // userId 및 calenderId를 이용하여 axios.delete 호출
        const response = await axios.delete(
            `/api/user/me/calender/${calenderId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        console.log(response.data);
        // 삭제 성공하면 true 반환
        return true;
    } catch (error) {
        console.log("삭제실패", error);
        if (error.response && error.response.status === 401) {
            alert("로그인 후 이용해주세요.");
            window.location.href = "http://localhost:8001/login.html";
        }
        console.error(
            "Error updating calendar event:",
            error.response ? error.response.data.message : error.message,
        );
        // 삭제 실패하면 false 반환
        return false;
    }
}

// 삭제 버튼에 클릭 이벤트를 연결하는 코드
document
    .getElementById("deleteButtonId")
    .addEventListener("click", async () => {
        console.log(currentEvent.id);
        const success = await deleteCalendar(currentEvent.id);

        if (success) {
            // 삭제 성공 시 필요한 동작 추가
            alert("삭제 완료");
            closeUpdateModal();
        } else {
            // 삭제 실패 시 필요한 동작 추가
            console.log("일정 삭제에 실패했습니다.");
        }
    });

function nextMonthDraw() {
    const thisMonth = init.date.getMonth();
    const thisYear = init.date.getFullYear();

    init.date = new Date(thisYear, thisMonth + 1, 1);
    init.drawCalendar();
}

// 이전 달로 이동하는 이벤트
$(".calendar-yearmonth div:nth-child(1)").on("click", prevMonthDraw);
// 다음 달로 이동하는 이벤트
$(".calendar-yearmonth div:nth-child(3)").on("click", nextMonthDraw);

// 초기 캘린더 그리기
init.drawCalendar();
