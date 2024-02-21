window.onload = async function () {
    loadHeader();
    loadFooter();
    try {
        // 현재 페이지 URL에서 query와 from 추출
        const { query, from } = getSearchParams();
        let totalResults;

        if (from === "club") {
            // club.html에서 검색한 경우
            const clubResults = await axios.get(
                `/api/search/club?query=${query}`,
            );
            totalResults = clubResults.data.club.total;
            const clubDiv = document.getElementById("clubResults");
            // 결과가 20개 이상인 경우에는 20개까지만 표시
            displayResults(
                clubDiv,
                clubResults.data.club.clubs.slice(0, resultsPerPage),
                "동아리",
            );
        } else if (from === "place") {
            // place.html에서 검색한 경우
            const placeResults = await axios.get(
                `/api/search/place?query=${query}`,
            );
            totalResults = placeResults.data.place.total;
            const placeDiv = document.getElementById("placeResults");
            // 결과가 20개 이상인 경우에는 20개까지만 표시
            displayResults(
                placeDiv,
                placeResults.data.place.places.slice(0, resultsPerPage),
                "장소",
            );
        } else if (from === "recruit") {
            // recruit.html 또는 myRecruit.html에서 검색한 경우
            const recruitResults = await axios.get(
                `/api/search/recruitment?query=${query}`,
            );
            totalResults = recruitResults.data.recruit.total;
            // 결과가 20개 이상인 경우에는 20개까지만 표시
            displayResults(
                document.getElementById("recruitResults"),
                recruitResults.data.recruit.recruits.slice(0, resultsPerPage),
                "모집글",
            );
        } else {
            // from이 null일 경우 전체 검색
            const clubResults = await axios.get(
                `/api/search/club?query=${query}`,
            );
            const recruitResults = await axios.get(
                `/api/search/recruitment?query=${query}`,
            );
            const placeResults = await axios.get(
                `/api/search/place?query=${query}`,
            );

            totalResults = placeResults.data.place.places.length;
            const loadMoreButton = document.getElementById("loadMoreButton");
            if (loadMoreButton) {
                console.log(totalResults);
                loadMoreButton.style.display =
                    totalResults > resultsPerPage ? "block" : "none";
            }

            const clubDiv = document.getElementById("clubResults");
            const recruitDiv = document.getElementById("recruitResults");
            const placeDiv = document.getElementById("placeResults");

            // 각 결과가 20개 이상인 경우에는 20개까지만 표시
            displayResults(
                clubDiv,
                clubResults.data.club.clubs.slice(0, resultsPerPage),
                "동아리",
            );
            displayResults(
                recruitDiv,
                recruitResults.data.recruit.recruits.slice(0, resultsPerPage),
                "모집글",
            );
            displayResults(
                placeDiv,
                placeResults.data.place.places.slice(0, resultsPerPage),
                "장소",
            );
        }
    } catch (error) {
        console.error("Error during page load:", error);
    }
};
// 검색 결과를 가져와서 화면에 표시하는 함수
async function displaySearchResults(query, from) {
    try {
        // 각 페이지에서 검색한 경우 해당 페이지에 맞는 API를 호출
        let results;
        if (from === "club") {
            // 동아리 페이지에서 검색한 경우
            results = await axios.get(`/api/search/club?query=${query}`);
        } else if (from === "recruit") {
            // 모집글 페이지에서 검색한 경우
            results = await axios.get(`/api/search/recruitment?query=${query}`);
        } else if (from === "place") {
            // 장소 페이지에서 검색한 경우
            results = await axios.get(`/api/search/place?query=${query}`);
        } else {
            // from이 null일 경우 전체 검색
            const clubResults = await axios.get(
                `/api/search/club?query=${query}`,
            );
            const recruitResults = await axios.get(
                `/api/search/recruitment?query=${query}`,
            );
            const placeResults = await axios.get(
                `/api/search/place?query=${query}`,
            );

            results = {
                data: {
                    club: { clubs: clubResults.data.club.clubs },
                    recruit: { recruits: recruitResults.data.recruit.recruits },
                    place: { places: placeResults.data.place.places },
                },
            };
        }

        const clubDiv = document.getElementById("clubResults");
        const recruitDiv = document.getElementById("recruitResults");
        const placeDiv = document.getElementById("placeResults");

        // 각 결과를 해당하는 div에 표시
        if (from === "club") {
            displayResults(clubDiv, results.data.club.clubs, "동아리");
        } else if (from === "recruit") {
            displayResults(recruitDiv, results.data.recruit.recruits, "모집글");
        } else if (from === "place") {
            displayResults(placeDiv, results.data.place.places, "장소");
        } else {
            displayResults(clubDiv, results.data.club.clubs, "동아리");
            displayResults(recruitDiv, results.data.recruit.recruits, "모집글");
            displayResults(placeDiv, results.data.place.places, "장소");
        }
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

// 검색 결과를 화면에 표시하는 함수
function displayResults(container, results, category) {
    if (!container) {
        console.error("Container is null or undefined.");
        return;
    }

    const h2Element = document.createElement("h2");
    h2Element.textContent = `${category} 검색 결과`;
    container.parentNode.insertBefore(h2Element, container);

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
            resultItem.innerHTML = `<div>
            <img src="${result.image}" alt="${result.name} 이미지">
            ${result.name} - ${result.address}
        </div>`;
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

// 더보기 버튼 클릭 시 이벤트 핸들러 등록
let currentResults = []; // 현재까지 표시된 모든 결과를 저장하는 배열
let totalResults = 0; // 전체 검색 결과 수를 저장하는 변수
let resultsPerPage = 20; // 페이지 당 결과 수
let displayedResults = 0;
// loadSearchResults 함수 수정
async function loadSearchResults(page) {
    currentResults = []; // 현재까지 표시된 모든 결과를 저장하는 배열 초기화
    const { query, from } = getSearchParams();
    try {
        // 각 페이지에서 검색한 경우 해당 페이지에 맞는 API를 호출
        let results;
        if (from === "club") {
            // 동아리 페이지에서 검색한 경우
            results = await axios.get(
                `/api/search/club?query=${query}&page=${page}&resultsPerPage=${resultsPerPage}`,
            );
        } else if (from === "recruit") {
            // 모집글 페이지에서 검색한 경우
            results = await axios.get(
                `/api/search/recruitment?query=${query}&page=${page}&resultsPerPage=${resultsPerPage}`,
            );
        } else if (from === "place") {
            // 장소 페이지에서 검색한 경우
            results = await axios.get(
                `/api/search/place?query=${query}&page=${page}&resultsPerPage=${resultsPerPage}`,
            );
        } else {
            // from이 null일 경우 전체 검색
            const clubResults = await axios.get(
                `/api/search/club?query=${query}&page=${page}&resultsPerPage=${resultsPerPage}`,
            );
            const recruitResults = await axios.get(
                `/api/search/recruitment?query=${query}&page=${page}&resultsPerPage=${resultsPerPage}`,
            );
            const placeResults = await axios.get(
                `/api/search/place?query=${query}&page=${page}&resultsPerPage=${resultsPerPage}`,
            );

            results = {
                data: {
                    club: { clubs: clubResults.data.club.clubs },
                    recruit: { recruits: recruitResults.data.recruit.recruits },
                    place: { places: placeResults.data.place.places },
                },
            };
        }

        // 총 검색 결과 수 업데이트
        totalResults = results.data.place.places.length;

        // 현재 페이지에 결과를 추가
        if (from === "club") {
            currentResults = currentResults.concat(results.data.club.clubs);
        } else if (from === "recruit") {
            currentResults = currentResults.concat(
                results.data.recruit.recruits,
            );
        } else if (from === "place") {
            currentResults = currentResults.concat(results.data.place.places);
        } else {
            currentResults = currentResults.concat(
                results.data.club.clubs,
                results.data.recruit.recruits,
                results.data.place.places,
            );
        }

        // 현재 페이지에 결과를 추가
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const pageResults = currentResults.slice(startIndex, endIndex);

        displayedResults += pageResults.length;

        // 현재 페이지에 결과를 추가
        const clubDiv = document.getElementById("clubResults");
        const recruitDiv = document.getElementById("recruitResults");
        const placeDiv = document.getElementById("placeResults");

        if (from === "club") {
            appendResults(
                clubDiv,
                results.data.club.clubs.slice(startIndex, endIndex),
                "동아리",
            );
            currentResults = currentResults.concat(
                results.data.club.clubs.slice(startIndex, endIndex),
            );
        } else if (from === "recruit") {
            appendResults(
                recruitDiv,
                results.data.recruit.recruits.slice(startIndex, endIndex),
                "모집글",
            );
            currentResults = currentResults.concat(
                results.data.recruit.recruits.slice(startIndex, endIndex),
            );
        } else if (from === "place") {
            appendResults(
                placeDiv,
                results.data.place.places.slice(startIndex, endIndex),
                "장소",
            );
            currentResults = currentResults.concat(
                results.data.place.places.slice(startIndex, endIndex),
            );
        } else {
            appendResults(
                clubDiv,
                results.data.club.clubs.slice(startIndex, endIndex),
                "동아리",
            );
            appendResults(
                recruitDiv,
                results.data.recruit.recruits.slice(startIndex, endIndex),
                "모집글",
            );
            appendResults(
                placeDiv,
                results.data.place.places.slice(startIndex, endIndex),
                "장소",
            );
            currentResults = currentResults.concat(
                results.data.club.clubs.slice(startIndex, endIndex),
                results.data.recruit.recruits.slice(startIndex, endIndex),
                results.data.place.places.slice(startIndex, endIndex),
            );
        }

        // 불러올 결과가 더 이상 없으면 더보기 버튼 숨김

        if (displayedResults + 20 >= totalResults) {
            const loadMoreButton = document.getElementById("loadMoreButton");
            if (loadMoreButton) {
                loadMoreButton.style.display = "none";
            }
        } else {
            const loadMoreButton = document.getElementById("loadMoreButton");
            if (loadMoreButton) {
                loadMoreButton.style.display = "block"; // 더보기 버튼 활성화
            }
        }
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

// 더보기 버튼 클릭 시 이벤트 핸들러 등록
let currentPage = 1;

document
    .getElementById("loadMoreButton")
    .addEventListener("click", async function () {
        currentPage++; // 다음 페이지로 이동
        await loadSearchResults(currentPage);
    });

// 검색 결과를 추가하는 함수
function appendResults(container, results, category) {
    if (!container) {
        console.error("Container is null or undefined.");
        return;
    }

    results.forEach((result) => {
        const resultItem = document.createElement("div");

        resultItem.addEventListener("click", function () {
            const detailPageURL = getDetailPageURL(result, category);
            if (detailPageURL) {
                window.location.href = detailPageURL;
            }
        });

        if (result.address) {
            resultItem.innerHTML = `<div>
            <img src="${result.image}" alt="${result.name} 이미지">
            ${result.name} - ${result.address}
        </div>`;
        } else if (result.title && result.content) {
            resultItem.innerHTML = `<div>${result.title} - ${result.content}</div>`;
        } else {
            resultItem.innerHTML = `<div>${result.name} - ${result.description}</div>`;
        }

        container.appendChild(resultItem);
    });
}

// URL에서 query와 from 값을 추출하는 함수
function getSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        query: urlParams.get("q"),
        from: urlParams.get("from"),
    };
}
