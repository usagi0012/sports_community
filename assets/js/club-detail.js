window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    let clubId = urlParams.get("id");

    getClubDetail(clubId);
};
const regionData = [
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

export default function getClubDetail(clubId) {
    console.log("##########");
    console.log("2번 클럽 아이디", clubId);
    // 보내는 순서 알아보기(header, params)
    const authorized = localStorage.getItem("authorized");
    const token = JSON.parse(authorized).accessToken.value;
    console.log("토큰값", token);
    console.log("클럽아이디", clubId);
    axios
        .get(`/api/club/${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            // console.log("here");
            // console.log("clubid????", clubId);
            // console.log("2번 response", response);
            // console.log("???????");

            const clubNameDiv = document.querySelector(".name");
            console.log("clubNameDiv", clubNameDiv);
            const clubNameDetail = document.createElement("div");
            clubNameDetail.className = "clubDetail";
            clubNameDetail.innerHTML += `${response.data.name}`;
            clubNameDiv.appendChild(clubNameDetail);

            const regionDiv = document.querySelector(".region");
            const region = document.createElement("div");
            region.className = "clubDetail";

            region.innerHTML += `${regionData[response.data.region]}`;

            regionDiv.appendChild(region);

            const classificationDiv = document.querySelector(".classification");
            const classification = document.createElement("div");
            classification.className = "clubDetail";

            classification.innerHTML += ``;
            classificationDiv.appendChild(classification);

            const genderDiv = document.querySelector(".gender");
            const gender = document.createElement("div");
            gender.className = "clubDetail";
            gender.innerHTML += ``;
            genderDiv.appendChild(gender);

            const memberDiv = document.querySelector(".member");
            const member = document.createElement("div");
            member.className = "clubDetail";
            member.innerHTML += `${response.data.member}`;
            memberDiv.appendChild(member);

            const createdAtDiv = document.querySelector(".createdAt");
            const createdAt = document.createElement("div");
            createdAt.className = "clubDetail";
            createdAt.innerHTML += `${response.data.createdAt}`;
            createdAtDiv.appendChild(createdAt);

            const clubMasterDiv = document.querySelector(".clubMaster");
            const clubMaster = document.createElement("div");
            clubMaster.className = "clubDetail";
            clubMaster.innerHTML += `${response.data.masterId}`;
            clubMasterDiv.appendChild(clubMaster);
        })
        .catch(function (error) {
            console.log("error response", error.response);
            // alert(error.request.response);
        });
}
