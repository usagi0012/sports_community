const mainContainer = document.getElementById("mainContainer");
const pageContainer = document.getElementById("pageContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

window.onload = function () {
    loadHeader();
    getPlace(1);
    loadFooter();
};

function getPlace(page) {
    axios
        .get(`/api/place?page=${page}`)
        .then(function (response) {
            console.log(response);
            mainContainer.innerHTML = "";
            response.data.data.forEach((place) => {
                mainContainer.innerHTML += `
                <div class="placeContainer" onclick="toPlaceLink(${place.link})">
                <div class="image">
                    <img
                        src="${place.image}"
                    />
                </div>
                <div class="name">${place.name}</div>
                <div class="address">
                ${place.address}
                </div>
              </div>
                `;
            });
            console.log(response.data.meta);
            renderPagination(response.data.meta);
        })
        .catch(function (error) {
            console.log(error);
            alert(error.request.response);
        });
}

function renderPagination(meta) {
    pageContainer.innerHTML = "";
    const totalPage = meta.lastPage;
    const currentPage = meta.page;
    const totalPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPage, startPage + totalPagesToShow - 1);

    if (endPage - startPage < totalPagesToShow - 1) {
        startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.innerText = i;

        if (i === currentPage) {
            pageLink.classList.add("active");
        }

        pageLink.addEventListener("click", function (e) {
            e.preventDefault();
            getPlace(i);
        });

        pageContainer.appendChild(pageLink);
    }

    // 이전에 추가된 클릭 이벤트 리스너 제거
    prevBtn.removeEventListener("click", handlePrevButtonClick);
    nextBtn.removeEventListener("click", handleNextButtonClick);

    // 새로운 클릭 이벤트 리스너 추가
    prevBtn.addEventListener("click", handlePrevButtonClick);
    nextBtn.addEventListener("click", handleNextButtonClick);
}

function handlePrevButtonClick(e) {
    e.preventDefault();
    const currentPage = parseInt(
        pageContainer.querySelector(".active").innerText,
        10,
    );
    getPlace(Math.max(1, currentPage - 1));
}

function handleNextButtonClick(e) {
    e.preventDefault();
    const currentPage = parseInt(
        pageContainer.querySelector(".active").innerText,
        10,
    );
    const totalPage = parseInt(pageContainer.lastChild.innerText, 10);
    getPlace(Math.min(totalPage, currentPage + 1));
}
