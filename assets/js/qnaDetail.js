window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    let qnaId = urlParams.get("id");
    getQnaDetail(qnaId);
    showCreateBtn();
    showCommentDiv();
    commentShow();
};

const qnaBoardDetail = document.querySelector(".detailContainer");
function getQnaDetail(qnaId) {
    const accessToken = localStorage.getItem("accessToken");
    axios
        .get(`/api/qna/${qnaId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            const qnaDetail = response.data.data;
            qnaBoardDetail.innerHTML = "";

            const topContent = document.createElement("div");
            topContent.classList.add("top");
            topContent.innerHTML = `
                <label class="title">${qnaDetail.title}</label>
                <div class="info">
                <div class="firstRow">
                    <dl class="hostName">
                        <dt>작성자</dt>
                        <dd>${qnaDetail.userName}</dd>
                    </dl>
                </div>
                <div class="secondRow">
                    <dl class="createDate">
                        <dt>작성일</dt>
                        <dd>${qnaDetail.createAt.slice(0, 10)}</dd>
                    </dl>
					<dl class="createDate">
                        <dt>작성일</dt>
                        <dd>${qnaDetail.updatedAt.slice(0, 10)}</dd>
                    </dl>
                </div>
                </div>
                <div class="cont">${qnaDetail.description}</div>
                <img src="${qnaDetail.image}" alt="Uploaded Image">
				
            `;
            qnaBoardDetail.appendChild(topContent);
        })

        .catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
}

function moveToUpdatePage() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams", urlParams);
    let qnaId = urlParams.get("id");

    window.location.href = `qnaUpdate.html?id=${qnaId}`;
}

function deletePage() {
    let result = confirm("QNA를 정말로 삭제하시겠습니까?");
    if (result) {
        deleteCheck();
    } else {
        alert("QNA 삭제를 취소했습니다.");
    }
}

function deleteCheck() {
    const urlParams = new URLSearchParams(window.location.search);
    let qnaId = urlParams.get("id");

    const token = localStorage.getItem("accessToken");

    axios
        .delete(`api/qna/${qnaId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log(response);
            alert(`${response.data.message}`);
            window.location.href = "qna.html";
        })
        .catch(function (error) {
            console.log(error);
            alert("QNA 삭제에 실패했습니다.");
        });
}

function showCreateBtn() {
    const updateBtn = document.querySelector(".updateBtn");
    const deleteBtn = document.querySelector(".deleteBtn");
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get("/api/qna/isUser", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            console.log("여기왔니?", response);
            updateBtn.style.display = "flex";
            deleteBtn.style.display = "flex";
        })
        .catch(function (error) {
            updateBtn.style.display = "none";
            deleteBtn.style.display = "none";
        });
}

//댓글기능
function displayComments(comments) {
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";

    comments.forEach((comment) => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        // Use innerHTML to set the content of commentDiv
        commentDiv.innerHTML = `
            <span class="user-name">${comment.masterName} </span>
            <p class="content">${comment.comment}</p>
			<div class="adminCommentBtn">
				<div>
					<button class="commentUpdateBtn" onclick="commentUpdate(${comment.id})">수정</button>
					<button class="commentDeleteBtn" onclick="commentDelete(${comment.id})">삭제</button>
				</div>
			</div>
        `;

        commentsList.appendChild(commentDiv);
    });
}

function showCommentDiv() {
    const comment = document.querySelector(".comment");
    const adminCommentBtn = document.querySelectorAll(".adminCommentBtn");

    const accessToken = localStorage.getItem("accessToken");

    axios
        .get("/api/qna/comment/isAdmin", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            comment.style.display = "flex";
            adminCommentBtn.style.display = "flex";
        })
        .catch(function (error) {
            comment.style.display = "none";
            adminCommentBtn.style.display = "none";
        });
}

function addComment() {
    const urlParams = new URLSearchParams(window.location.search);
    let qnaId = urlParams.get("id");
    const commentInput = document.getElementById("comment-input");
    const newComment = commentInput.value.trim();

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    if (newComment !== "") {
        axios
            .post(
                `/api/qna/${qnaId}/comment`,
                { masterId: userId, comment: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                commentInput.value = "";
                commentShow();
            })
            .catch((error) => console.error("댓글 작성 실패:", error));
    }
}

function commentShow() {
    const urlParams = new URLSearchParams(window.location.search);
    let qnaId = urlParams.get("id");
    const accessToken = localStorage.getItem("accessToken");

    axios
        .get(`/api/qna/${qnaId}/comment`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((response) => {
            console.log(response);
            const comments = response.data.data;
            displayComments(comments);
        })
        .catch((error) => console.error("댓글 조회 실패:", error));
}

function commentDelete(qnaCommentId) {
    const urlParams = new URLSearchParams(window.location.search);
    let qnaId = urlParams.get("id");

    const token = localStorage.getItem("accessToken");

    axios
        .delete(`/api/qna/${qnaId}/comment/${qnaCommentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            alert(`${response.data.message}`);
            commentShow();
        })
        .catch(function (error) {
            console.log(error);
            alert("QNA 댓글 삭제에 실패했습니다.");
        });
}
// 모달 열기
function openModal(qnaCommentId) {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.setAttribute("data-qna-comment-id", qnaCommentId);
    modalContainer.style.display = "block";
}

// 모달 닫기
function closeModal() {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none";
}

function commentUpdate(qnaCommentId) {
    openModal(qnaCommentId);
}

function updateComment() {
    const modalContainer = document.getElementById("modal-container");
    const qnaCommentId = modalContainer.getAttribute("data-qna-comment-id");

    const urlParams = new URLSearchParams(window.location.search);
    const qnaId = urlParams.get("id");

    const updatedCommentInput =
        document.getElementById("edit-comment-input").value;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
    axios
        .put(
            `/api/qna/${qnaId}/comment/${qnaCommentId}`,
            {
                masterId: userId,
                qnaId: qnaId,
                comment: updatedCommentInput,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )
        .then((response) => {
            alert(response.data.message);
            commentShow();
            closeModal(); // 업데이트 후 모달 닫기
        })
        .catch((error) => console.error("댓글 수정 실패:", error));
}
