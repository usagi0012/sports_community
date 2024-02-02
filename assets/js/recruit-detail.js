window.onload = function () {
    loadHeader();
    loadFooter();
    const urlParams = new URLSearchParams(window.location.search);
    let recruitId = urlParams.get("id");

    getRecruitDetail(+recruitId);

    document
        .getElementById("modalOpenButton")
        .addEventListener("click", function () {
            openApplyingModal();
        });

    function openApplyingModal() {
        document.getElementById("applyModal").classList.remove("hidden");
    }

    function closeApplyingModal() {
        document.getElementById("applyModal").classList.add("hidden");
    }

    document
        .getElementById("submit-application")
        .addEventListener("click", function () {
            submitApplication(recruitId);
        });

    document
        .getElementById("close-modal")
        .addEventListener("click", function () {
            closeApplyingModal();
        });
};

const region = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충청북도",
    "충청남도",
    "경상북도",
    "경상남도",
    "전라북도",
    "전라남도",
    "제주도",
];

const feedBoardDetail = document.querySelector(".detailContainer");

function getRecruitDetail(recruitId) {
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get(`/api/recruit/${recruitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const recruitDetail = response.data;

            feedBoardDetail.innerHTML = "";

            // Add new content
            const topContent = document.createElement("div");
            topContent.classList.add("top");
            topContent.innerHTML = `
                <label class="title">${recruitDetail.title}</label>
                <div class="info">
                <div class="firstRow">
                    <dl class="hostName">
                        <dt>작성자</dt>
                        <dd>${recruitDetail.hostName}</dd>
                    </dl>
                    <dl class="region">
                        <dt>지역</dt>
                        <dd>${region[recruitDetail.region]}</dd>
                    </dl>
                    <dl class="status">
                    <dt>상태</dt>
                    <dd>${recruitDetail.status}</dd>
                </dl>
                <dl class="gps">
                <dd id="gpsBtn" onclick="openMapModal('${recruitDetail.gps}')">
                    ${recruitDetail.gps}
                </dd>
            </dl>
            
            </dl>
                </div>
                <div class="secondRow">
                    <dl class="rule">
                        <dt>rule</dt>
                        <dd>${recruitDetail.rule}</dd>
                    </dl>
                    <dl class="member">
                        <dt>인원</dt>
                        <dd>${recruitDetail.totalmember} / ${
                            recruitDetail.basictotalmember
                        }</dd>
                    </dl>
                    <dl class="gamedate">
                    <dt>경기 예정 시간</dt>
                    <dd>${
                        recruitDetail.gamedate.slice("T", 10).padEnd(12, " ") +
                        recruitDetail.gamedate.slice(11, 16)
                    } - ${
                        recruitDetail.endtime.slice("T", 10).padEnd(12, " ") +
                        recruitDetail.endtime.slice(11, 16)
                    }</dd>
                </dl>
                </div>
                </div>
                <div class="cont">${recruitDetail.content}</div>
            `;
            feedBoardDetail.appendChild(topContent);
            const adreessElement = document.getElementById("adreess");
            if (adreessElement) {
                adreessElement.innerText = recruitDetail.gps;
            }
        })

        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

function openMapModal(gpsData) {
    var modal = document.getElementById("mapModal");
    console.log(gpsData);

    modal.style.display = "block";
    showWhere(gpsData);
}

function closeMapModal() {
    var modal = document.getElementById("mapModal");

    // 모달을 감추도록 설정
    modal.style.display = "none";
}

function submitApplication(recruitId) {
    const inputMessage = document.getElementById("description1");
    const message = inputMessage.value;

    const accessToken = localStorage.getItem("accessToken");
    // 신청을 서버에 전송하는 Axios 코드를 추가합니다.
    axios
        .post(
            `/api/match/post/${recruitId}`,
            {
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )
        .then(function (response) {
            // 성공적으로 처리된 경우 추가적인 처리를 할 수 있습니다.
            console.log(response);
            alert("신청 완료");
            document
                .getElementById("applyModal")
                .setAttribute("hidden", "true");
        })
        .catch(function (error) {
            console.error(error.response.data);
            alert(error.response.data.message);
        });
}

var map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(37.5665, 126.978),
    zoom: 10,
});

var marker = new naver.maps.Marker({
    map: map,
});

var infoWindow = new naver.maps.InfoWindow();

function showWhere(gpsData) {
    var address = gpsData;
    naver.maps.Service.geocode(
        {
            query: address,
        },
        function (status, response) {
            if (status === naver.maps.Service.Status.ERROR) {
                console.error("Something went wrong:", response);
                return;
            }

            if (response.v2.meta.totalCount === 0) {
                alert("No results found for the address: " + address);
                return;
            }

            var item = response.v2.addresses[0];
            var point = new naver.maps.Point(item.x, item.y);

            marker.setPosition(point);

            // var htmlAddresses = [];

            // if (item.roadAddress) {
            //     htmlAddresses.push("[도로명 주소] " + item.roadAddress);
            // }

            // if (item.jibunAddress) {
            //     htmlAddresses.push("[지번 주소] " + item.jibunAddress);
            // }

            // if (item.englishAddress) {
            //     htmlAddresses.push("[영문명 주소] " + item.englishAddress);
            // }

            infoWindow.setContent(
                [
                    '<div style="padding:10px;min-width:100px;line-height:100%;">',
                    '<h4 style="margin-top:5px;">검색 주소 : ' +
                        address +
                        "</div>",
                ].join("\n"),
            );

            map.setCenter(point);
            infoWindow.open(map, marker);
        },
    );
}
