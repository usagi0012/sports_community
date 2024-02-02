function initNotification() {
    const accessToken = localStorage.getItem("accessToken");
    const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
    const userId = tokenPayload.userId;
    const eventSource = new EventSource(
        `http://localhost:8001/api/sse/${userId}`,
    );

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        showNotification(data.message, data.link); // 링크 정보 추가
    };

    eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
    };

    function showNotification(message, link) {
        // 브라우저 알림을 표시하는 로직
        const notification = new Notification("알림", { body: message });

        // 알림 클릭 이벤트 핸들러
        notification.onclick = () => {
            if (link) {
                // 링크 정보가 있으면 해당 링크로 이동
                window.location.href = link;
            }
        };
    }
}

// 해당 스크립트 파일의 기능을 초기화하는 함수를 추가
initNotification();
