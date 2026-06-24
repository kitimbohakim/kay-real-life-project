document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "krl_submissions";
    const tableBody = document.getElementById("submissionsTableBody");
    const modal = document.getElementById("submissionModal");
    const closeModalBtn = document.querySelector(".close-modal");

    const searchInput =
        document.getElementById("searchSubmission");
    const deleteSubmissionBtn = document.getElementById("deleteSubmissionBtn");
    const modalName = document.getElementById("modalName");
    const modalEmail = document.getElementById("modalEmail");
    const modalPhone = document.getElementById("modalPhone");
    const modalArtist = document.getElementById("modalArtist");
    const modalCountry = document.getElementById("modalCountry");
    const modalStatus = document.getElementById("modalStatus");
    const modalMessage = document.getElementById("modalMessage");
    const adminNotes =
        document.getElementById("adminNotes");

    const saveNotesBtn =
        document.getElementById("saveNotesBtn");

    let selectedSubmissionId = null;

    function getSubmissions() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function saveSubmissions(submissions) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    }

    function updateStats() {

        const submissions = getSubmissions();

        const newCount =
            submissions.filter(
                item => item.status === "New"
            ).length;

        const contactedCount =
            submissions.filter(
                item => item.status === "Contacted"
            ).length;

        const progressCount =
            submissions.filter(
                item => item.status === "In Progress"
            ).length;

        const completedCount =
            submissions.filter(
                item => item.status === "Completed"
            ).length;

        document.getElementById("newLeadsCount").textContent =
            newCount;

        document.getElementById("contactedCount").textContent =
            contactedCount;

        document.getElementById("progressCount").textContent =
            progressCount;

        document.getElementById("completedCount").textContent =
            completedCount;
    }

    function renderTable() {

        if (!tableBody) return;

        let submissions = getSubmissions();

        const searchTerm =
            searchInput?.value
                .toLowerCase()
                .trim() || "";

        if (searchTerm) {

            submissions = submissions.filter(item =>

                (item.name || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (item.artist || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (item.email || "")
                    .toLowerCase()
                    .includes(searchTerm)

            );

        }

        tableBody.innerHTML = submissions.length
            ? submissions.map((item) => `
        <tr>
            <td>${item.name || ""}</td>
            <td>${item.artist || ""}</td>
            <td>${item.country || item.countryCode || ""}</td>
            <td>
                <span class="status ${getStatusClass(item.status)}">
                    ${item.status || "New"}
                </span>
            </td>
            <td>${item.createdAt || ""}</td>
            <td>
                <button
                    class="action-btn view-btn"
                    type="button"
                    data-id="${item.id}">
                    View
                </button>
            </td>
        </tr>
    `).join("")
            : `
        <tr>
            <td colspan="6">
                No submissions yet.
            </td>
        </tr>
    `;
    }


    function getStatusClass(status) {
        const value = (status || "").toLowerCase();
        if (value.includes("contacted")) return "contacted";
        if (value.includes("completed")) return "completed";
        if (value.includes("rejected") || value.includes("serious")) return "rejected";
        return "new";
    }

    function openModal(submission) {
        if (!modal || !submission) return;

        selectedSubmissionId = submission.id;

        modalName.textContent = submission.name || "-";
        modalEmail.textContent = submission.email || "-";
        modalPhone.textContent = submission.phone || "-";
        modalArtist.textContent = submission.artist || "-";
        modalCountry.textContent =
            submission.countryCode || "-";
        modalStatus.textContent = submission.status || "New";
        modalMessage.textContent = submission.message || "-";

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        adminNotes.value =
            submission.notes || "";
    }

    function closeModal() {
        if (!modal) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        selectedSubmissionId = null;
    }

    if (tableBody) {
        tableBody.addEventListener("click", (event) => {
            const button = event.target.closest(".view-btn");
            if (!button) return;

            const id = Number(button.dataset.id);
            const submission = getSubmissions().find((item) => item.id === id);

            if (submission) openModal(submission);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    const statusButtons = document.querySelectorAll(".status-btn");
    statusButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!selectedSubmissionId) return;

            const newStatus = btn.dataset.status;
            const submissions = getSubmissions();
            const index = submissions.findIndex((item) => item.id === selectedSubmissionId);

            if (index === -1) return;

            submissions[index].status = newStatus;
            saveSubmissions(submissions);

            modalStatus.textContent = newStatus;

            renderTable();
            updateStats();
        });
    });

    renderTable();
    updateStats();

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderTable
        );

    }

    if (saveNotesBtn) {

        saveNotesBtn.addEventListener("click", () => {

            if (!selectedSubmissionId) return;

            const submissions =
                getSubmissions();

            const index =
                submissions.findIndex(
                    item => item.id === selectedSubmissionId
                );

            if (index === -1) return;

            submissions[index].notes =
                adminNotes.value;

            saveSubmissions(submissions);

            alert("Notes saved.");

        });

    }

    if (deleteSubmissionBtn) {
        deleteSubmissionBtn.addEventListener("click", () => {
            if (!selectedSubmissionId) return;

            const confirmDelete = confirm(
                "Are you sure you want to delete this submission?"
            );

            if (!confirmDelete) return;

            let submissions = getSubmissions();

            submissions = submissions.filter(
                (item) => item.id !== selectedSubmissionId
            );

            saveSubmissions(submissions);

            closeModal();
            renderTable();
            updateStats();
        });
    }
});
