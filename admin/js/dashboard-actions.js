document.addEventListener("DOMContentLoaded", () => {
    const app = window.KRLDashboard;
    if (!app) return;

    const saveNotesBtn = document.getElementById("saveNotesBtn");
    const deleteSubmissionBtn = document.getElementById("deleteSubmissionBtn");
    const adminNotes = document.getElementById("adminNotes");
    const statusButtons = document.querySelectorAll(".status-btn");

    if (saveNotesBtn) {
        saveNotesBtn.addEventListener("click", async () => {
            if (!app.selectedSubmissionId) return;

            const submissions = app.getSubmissions();
            const index = submissions.findIndex(
                (item) => String(item.id) === String(app.selectedSubmissionId)
            );

            if (index === -1) return;

            submissions[index].notes = adminNotes ? adminNotes.value : "";
            submissions[index].updatedAt = new Date().toLocaleString();

            await app.saveSubmissions(submissions);

            await app.addActivity(
                "Notes Updated",
                `Notes saved for ${submissions[index].artist || submissions[index].name || "Unknown Artist"}`,
                "note"
            );

            app.renderTable();
            app.updateStats();
            app.renderActivity();

            saveNotesBtn.textContent = "✓ Notes Saved";
            setTimeout(() => {
                saveNotesBtn.textContent = "Save Notes";
            }, 2000);
        });
    }

    if (deleteSubmissionBtn) {
        deleteSubmissionBtn.addEventListener("click", async () => {
            if (!app.selectedSubmissionId) return;

            const confirmDelete = confirm(
                "Are you sure you want to delete this submission?"
            );

            if (!confirmDelete) return;

            const submissions = app.getSubmissions();
            const deletedSubmission = submissions.find(
                (item) => String(item.id) === String(app.selectedSubmissionId)
            );

            const updatedSubmissions = submissions.filter(
                (item) => String(item.id) !== String(app.selectedSubmissionId)
            );

            await app.saveSubmissions(updatedSubmissions);

            await app.addActivity(
                "Submission Deleted",
                `${deletedSubmission?.artist || deletedSubmission?.name || "Unknown Artist"} was removed`,
                "deleted"
            );

            app.closeModal();
            app.renderTable();
            app.updateStats();
            app.renderActivity();
        });
    }

    statusButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
            if (!app.selectedSubmissionId) return;

            const newStatus = btn.dataset.status;
            const submissions = app.getSubmissions();
            const index = submissions.findIndex(
                (item) => String(item.id) === String(app.selectedSubmissionId)
            );

            if (index === -1) return;

            const now = new Date().toLocaleString();

            submissions[index].status = newStatus;

            if (!Array.isArray(submissions[index].statusHistory)) {
                submissions[index].statusHistory = [];
            }

            submissions[index].statusHistory.push({
                status: newStatus,
                at: now
            });

            submissions[index].updatedAt = now;

            await app.saveSubmissions(submissions);

            await app.addActivity(
                "Status Updated",
                `${submissions[index].artist || submissions[index].name || "Unknown Artist"} moved to ${newStatus}`,
                "new"
            );

            if (app.modalStatus) {
                app.modalStatus.textContent = newStatus;
            }

            app.renderTable();
            app.updateStats();
            app.renderActivity();
        });
    });

    console.log("dashboard-actions.js loaded");
});