async function getClubDetail(clubId) {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(server + "/api/club", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            clubId: clubId,
        },
        // 보내는 순서 알아보기(header, params)
    });
    console.log(response);
    const clubNameDiv = doucument.querySelector(".clubName");

    const clubName = document.createElement("div");
    clubName.innerHTML = ``;
}
