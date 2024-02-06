window.onload = async function () {
    try {
        // 현재 페이지 URL에서 query와 from 추출
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get("q");
        const from = urlParams.get("from");
        const searchQuery = query; // searchQuery 변수 정의

        if (from === "club") {
            // club.html에서 검색한 경우
            const clubResults = await axios.get(
                `/api/search/club?query=${query}`,
            );
            const clubDiv = document.getElementById("clubResults");
            displayResults(clubDiv, clubResults.data.club.clubs, "동아리");
        } else if (from === "place") {
            // place.html에서 검색한 경우
            const placeResults = await axios.get(
                `/api/search/place?query=${query}`,
            );
            const placeDiv = document.getElementById("placeResults");
            displayResults(placeDiv, placeResults.data.place.places, "장소");
        } else if (from === "recruit") {
            // recruit.html 또는 myRecruit.html에서 검색한 경우
            const recruitResults = await axios.get(
                `/api/search/recruitment?query=${query}`,
            );
            displayResults(
                document.getElementById("recruitResults"),
                recruitResults.data.recruit.recruits,
                "모집글",
            );
        } else {
            // 다른 페이지에서 검색한 경우
            await displaySearchResults(searchQuery);
        }
    } catch (error) {
        console.error("Error during page load:", error);
    }
};

// 검색 결과를 가져와서 화면에 표시하는 함수
async function displaySearchResults(query) {
    try {
        console.log(query);

        //동아리 검색 결과 표시
        const clubResults = await axios.get(`/api/search/club?query=${query}`);
        console.log(clubResults.data.club.clubs);
        const clubDiv = document.getElementById("clubResults");
        displayResults(clubDiv, clubResults.data.club.clubs, "동아리");

        // 모집글 검색 결과 표시
        const recruitResults = await axios.get(
            `/api/search/recruitment?query=${query}`,
        );
        displayResults(
            document.getElementById("recruitResults"),
            recruitResults.data.recruit.recruits,
            "모집글",
        );

        console.log("먼데", recruitResults.data.recruit.recruits);
        // 장소 검색 결과 표시
        const placeResults = await axios.get(
            `/api/search/place?query=${query}`,
        );
        displayResults(
            document.getElementById("placeResults"),
            placeResults.data.place.places,
            "장소",
        );

        console.log(placeResults.data.place.places);
        window.history.pushState(
            { query },
            "Search Results",
            `search.html?q=${encodeURIComponent(query)}`,
        );
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

// 검색 결과를 화면에 표시하는 함수
function displayResults(container, results, category) {
    console.log(container, results, category);

    if (!container) {
        console.error("Container is null or undefined.");
        return;
    }

    container.innerHTML = `<h2>${category} 검색 결과</h2>`;

    if (results.length === 0) {
        container.innerHTML += "<p>검색 결과가 없습니다.</p>";
        return;
    }

    results.forEach((result) => {
        const resultItem = document.createElement("div");

        // 클릭 이벤트 추가
        resultItem.addEventListener("click", function () {
            // 클릭된 결과에 따라 상세 페이지로 이동
            const detailPageURL = getDetailPageURL(result, category);
            if (detailPageURL) {
                window.location.href = detailPageURL;
            }
        });

        if (result.address) {
            resultItem.innerHTML = `<div>${result.name} - ${result.address}</div>`;
        } else if (result.title && result.content) {
            resultItem.innerHTML = `<div>${result.title} - ${result.content}</div>`;
        } else {
            resultItem.innerHTML = `<div>${result.name} - ${result.description}</div>`;
        }

        container.appendChild(resultItem);
    });
}

// 결과의 상세 페이지 URL을 생성하는 함수
function getDetailPageURL(result, category) {
    // 각 카테고리에 따라 상세 페이지 URL 생성 로직 추가
    if (category === "동아리") {
        return `/club-detail.html?id=${result.id}`;
    }
    if (category === "모집글") {
        return `/recruit-detail.html?id=${result.id}`;
    }
    if (category === "장소") {
        return `https://shareit.kr/venue/${result.link}`;
    }
    // 다른 카테고리에 대한 상세 페이지 URL 생성 로직 추가
    // ...

    // 기본적으로는 빈 문자열 반환
    return "";
}
