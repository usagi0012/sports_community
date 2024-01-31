window.onload = function () {
    loadHeader();
    loadFooter();
};

// function submitForm() {
//     console.log("submitForm들어옴");
//     const name = document.getElementById("name").value;
//     const region = document.getElementById("location").value;
//     const description = document.getElementById("description").value;
//     const file = document.getElementById("fileInput").files[0];

//     const authorized = localStorage.getItem("authorized");
//     const token = JSON.parse(authorized).accessToken.value;
//     axios
//         .post(
//             "/api/club",
//             {
//                 name: name,
//                 region: region,
//                 description: description,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             },
//         )
//         .then(function (response) {
//             console.log(response);
//         })
//         .catch(function (error) {
//             console.log(error.response);
//             alert("동아리를 등록할 수 없습니다.");
//         });

//     //폼 제출 후 모달 닫기
//     closeModal();

//     // 폼 제출 후 페이지 리로드
//     window.location.reload();
// }
