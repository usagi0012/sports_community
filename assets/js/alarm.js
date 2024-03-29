window.onload = function () {
    loadHeader();
    loadFooter();
    loadUserMenu();
};

const notificationContainer = document.getElementById("notification-container");
const notificationTemplate = document.getElementById(
    "notification-template-content",
);

// 예시 Access Token. 실제로는 로그인 후 얻어온 토큰을 사용해야 합니다.
const accessToken = localStorage.getItem("accessToken");

async function displayNotifications() {
    try {
        // 서버에 알림 목록을 가져오는 GET 요청
        const response = await axios.get("/api/userAlarm", {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Access Token을 헤더에 추가
            },
        });
        const notifications = response.data.data.getAlarms;
        notificationContainer.innerHTML = "";
        notifications.forEach((notification) => {
            const notificationElement = createNotificationElement(notification);
            if (notificationElement) {
                notificationContainer.appendChild(notificationElement);
            }
        });
    } catch (error) {
        console.error("알림 목록 가져오기 실패:", error);
    }
}

function createNotificationElement(notification) {
    if (!notificationTemplate || !notificationTemplate.innerHTML) {
        console.error("Notification template or its content is undefined");
        return null;
    }

    const templateContent =
        notificationTemplate.content || notificationTemplate;

    // templateContent의 내용을 복사
    const clone = document.importNode(templateContent, true);

    // 클래스를 복사한 템플릿 내에서 찾음
    const notificationElement = clone.querySelector(".notification");
    const messageElement = clone.querySelector(".message");

    if (!notificationElement || !messageElement) {
        console.error("Required elements not found in template");
        return null;
    }

    // createdAtKST를 표시하는 요소 추가
    const createdAtElement = clone.querySelector(".created-at");
    if (createdAtElement) {
        const createdAtKST = convertUtcToKst(notification.createdAt);
        createdAtElement.textContent = createdAtKST;
    }

    messageElement.textContent = notification.message;
    notificationElement.dataset.notificationId = notification.id;
    return clone;
}

async function deleteNotification(deleteButton) {
    const notificationElement = deleteButton.closest(".notification");
    const notificationId = notificationElement.dataset.notificationId;

    // 사용자에게 확인 다이얼로그를 띄우고 확인 시에만 삭제 진행
    const isConfirmed = confirm("알림을 삭제하시겠습니까?");
    if (!isConfirmed) {
        return;
    }

    try {
        // 서버에 알림 삭제를 요청하는 DELETE 요청
        await axios.delete(`/api/userAlarm/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // 삭제된 알림을 UI에서 제거
        notificationElement.remove();
    } catch (error) {
        console.error("알림 삭제 실패:", error);
    }
}

function convertUtcToKst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const kstOffset = 9 * 60;
    const kstDate = new Date(utcDate.getTime() + kstOffset * 60000);

    // kstDate를 원하는 형식으로 포맷팅
    const formattedDate = kstDate.toLocaleString("en-US", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return formattedDate;
}

// 페이지 로드 시 알림 목록을 가져와서 표시
displayNotifications();

async function toUp() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}
