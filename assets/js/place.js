const mainContainer = document.getElementById("mainContainer");
const pageContainer = document.getElementById("pageContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

window.onload = function () {
    getPlace(1);
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

    prevBtn.addEventListener("click", function (e) {
        e.preventDefault();
        getPlace(Math.max(1, currentPage - 1));
    });

    nextBtn.addEventListener("click", function (e) {
        e.preventDefault();
        getPlace(Math.min(totalPage, currentPage + 1));
    });
}
