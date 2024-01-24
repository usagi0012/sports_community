async function getClubDetail() {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("/api/club", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            clubId: 1,
        },
        // 보내는 순서 알아보기(header, params)
    });
    console.log(response);

    const clubNameDiv = doucument.querySelector(".clubName");
    const clubName = document.createElement("div");
    clubName.innerHTML += `${response.name}`;
    clubNameDiv.appendChild(clubName)

    const regionDiv = document.querySelector(".region");
    const region = document.createElement("div")
    region.innerHTML +=`${response.region}`;
    regionDiv.appendChild(region);

    const classificationDiv = document.querySelector(".classification");
    const classification = document.createElement("div")
    classification.innerHTML +=``;
    classificationDiv.appendChild(classfication);

    const genderDiv = document.querySelector(".gender");
    const gender = document.createElement("div")
    gender.innerHTML +=``;
    genderDiv.appendChild(gender);

    const memberDiv = document.querySelector(".member");
    const member = document.createElement("div")
    member.innerHTML +=`${member}`;
    memberDiv.appendChild(member);

    const createdAtDiv = document.querySelector(".createdAt")
    const createdAt = document.createElement("div")
    createdAt.innerHTML +=`${response.createdAt}`;
    createdAtDiv.appendChild(createdAt)

    const clubMasterDiv = document.querySelector(".clubMaster")
    const clubMaster = document.createElement("div")
    clubMaster.innerHTML +=`${response.masterId}`;
    clubMasterDiv.appendChild(clubMaster)
}
