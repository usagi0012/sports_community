// window.onload = async function () {
//     loadHeader();
//     loadFooter();
//     try {
//         // 현재 페이지 URL에서 query와 from 추출
//         const urlParams = new URLSearchParams(window.location.search);
//         const query = urlParams.get("q");
//         const from = urlParams.get("from");
//         const searchQuery = query; // searchQuery 변수 정의

//         // Search 버튼 클릭 이벤트 핸들러 추가
//         const searchForm = document.querySelector("form");
//         searchForm.addEventListener("submit", async function (event) {
//             event.preventDefault(); // 기본 동작 방지 (페이지 새로고침 방지)

//             const searchInput = document.getElementById("searchInput");
//             const searchQuery = searchInput.value.trim(); // 앞뒤 공백 제거

//             // 검색어가 있을 경우에만 검색 수행
//             if (searchQuery) {
//                 await displaySearchResults(searchQuery, from);
//             }
//         });

//         const searchBtn = document.getElementById("searchBtn");
//         searchBtn.addEventListener("click", async function (event) {
//             event.preventDefault(); // 기본 동작 방지 (페이지 새로고침 방지)

//             // 검색어 가져오기
//             const searchInput = document.getElementById("searchInput");
//             const searchQuery = searchInput.value.trim(); // 앞뒤 공백 제거

//             // 해당 from 값으로 검색 결과 가져오기
//             await displaySearchResults(searchQuery, from);
//         });

//         if (from === "club") {
//             // club.html에서 검색한 경우
//             const clubResults = await axios.get(
//                 `/api/search/club?query=${query}`,
//             );
//             const clubDiv = document.getElementById("clubResults");
//             displayResults(clubDiv, clubResults.data.club.clubs, "동아리");
//         } else if (from === "place") {
//             // place.html에서 검색한 경우
//             const placeResults = await axios.get(
//                 `/api/search/place?query=${query}`,
//             );
//             const placeDiv = document.getElementById("placeResults");
//             displayResults(placeDiv, placeResults.data.place.places, "장소");
//         } else if (from === "recruit") {
//             // recruit.html 또는 myRecruit.html에서 검색한 경우
//             const recruitResults = await axios.get(
//                 `/api/search/recruitment?query=${query}`,
//             );
//             displayResults(
//                 document.getElementById("recruitResults"),
//                 recruitResults.data.recruit.recruits,
//                 "모집글",
//             );
//         } else {
//             // from이 null일 경우 전체 검색
//             const clubResults = await axios.get(
//                 `/api/search/club?query=${query}`,
//             );
//             const recruitResults = await axios.get(
//                 `/api/search/recruitment?query=${query}`,
//             );
//             const placeResults = await axios.get(
//                 `/api/search/place?query=${query}`,
//             );

//             const clubDiv = document.getElementById("clubResults");
//             const recruitDiv = document.getElementById("recruitResults");
//             const placeDiv = document.getElementById("placeResults");

//             displayResults(clubDiv, clubResults.data.club.clubs, "동아리");
//             displayResults(
//                 recruitDiv,
//                 recruitResults.data.recruit.recruits,
//                 "모집글",
//             );
//             displayResults(placeDiv, placeResults.data.place.places, "장소");
//         }
//     } catch (error) {
//         console.error("Error during page load:", error);
//     }
// };

// // 검색 결과를 가져와서 화면에 표시하는 함수
// async function displaySearchResults(query, from) {
//     try {
//         console.log(query);

//         // 각 페이지에서 검색한 경우 해당 페이지에 맞는 API를 호출
//         let results;
//         if (from === "club") {
//             // 동아리 페이지에서 검색한 경우
//             results = await axios.get(`/api/search/club?query=${query}`);
//         } else if (from === "recruit") {
//             // 모집글 페이지에서 검색한 경우
//             results = await axios.get(`/api/search/recruitment?query=${query}`);
//         } else if (from === "place") {
//             // 장소 페이지에서 검색한 경우
//             results = await axios.get(`/api/search/place?query=${query}`);
//         } else {
//             // from이 null일 경우 전체 검색
//             const clubResults = await axios.get(
//                 `/api/search/club?query=${query}`,
//             );
//             const recruitResults = await axios.get(
//                 `/api/search/recruitment?query=${query}`,
//             );
//             const placeResults = await axios.get(
//                 `/api/search/place?query=${query}`,
//             );

//             results = {
//                 data: {
//                     club: { clubs: clubResults.data.club.clubs },
//                     recruit: { recruits: recruitResults.data.recruit.recruits },
//                     place: { places: placeResults.data.place.places },
//                 },
//             };
//         }

//         const clubDiv = document.getElementById("clubResults");
//         const recruitDiv = document.getElementById("recruitResults");
//         const placeDiv = document.getElementById("placeResults");

//         // 각 결과를 해당하는 div에 표시
//         if (from === "club") {
//             displayResults(clubDiv, results.data.club.clubs, "동아리");
//         } else if (from === "recruit") {
//             displayResults(recruitDiv, results.data.recruit.recruits, "모집글");
//         } else if (from === "place") {
//             displayResults(placeDiv, results.data.place.places, "장소");
//         } else {
//             displayResults(clubDiv, results.data.club.clubs, "동아리");
//             displayResults(recruitDiv, results.data.recruit.recruits, "모집글");
//             displayResults(placeDiv, results.data.place.places, "장소");
//         }
//     } catch (error) {
//         console.error("Error fetching search results:", error);
//     }
// }

// // 검색 결과를 화면에 표시하는 함수
// function displayResults(container, results, category) {
//     console.log(container, results, category);

//     if (!container) {
//         console.error("Container is null or undefined.");
//         return;
//     }

//     container.innerHTML = `<h2>${category} 검색 결과</h2>`;

//     if (results.length === 0) {
//         container.innerHTML += "<p>검색 결과가 없습니다.</p>";
//         return;
//     }

//     results.forEach((result) => {
//         const resultItem = document.createElement("div");

//         // 클릭 이벤트 추가
//         resultItem.addEventListener("click", function () {
//             // 클릭된 결과에 따라 상세 페이지로 이동
//             const detailPageURL = getDetailPageURL(result, category);
//             if (detailPageURL) {
//                 window.location.href = detailPageURL;
//             }
//         });

//         if (result.address) {
//             resultItem.innerHTML = `<div>${result.name} - ${result.address}</div>`;
//         } else if (result.title && result.content) {
//             resultItem.innerHTML = `<div>${result.title} - ${result.content}</div>`;
//         } else {
//             resultItem.innerHTML = `<div>${result.name} - ${result.description}</div>`;
//         }

//         container.appendChild(resultItem);
//     });
// }

// // 결과의 상세 페이지 URL을 생성하는 함수
// function getDetailPageURL(result, category) {
//     // 각 카테고리에 따라 상세 페이지 URL 생성 로직 추가
//     if (category === "동아리") {
//         return `/club-detail.html?id=${result.id}`;
//     }
//     if (category === "모집글") {
//         return `/recruit-detail.html?id=${result.id}`;
//     }
//     if (category === "장소") {
//         return `https://shareit.kr/venue/${result.link}`;
//     }
//     // 다른 카테고리에 대한 상세 페이지 URL 생성 로직 추가
//     // ...

//     // 기본적으로는 빈 문자열 반환
//     return "";
// }
