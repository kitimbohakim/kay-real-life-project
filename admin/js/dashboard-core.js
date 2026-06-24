document.addEventListener("DOMContentLoaded", () => {
    const app = (window.KRLDashboard = window.KRLDashboard || {});

    app.db = window.firebaseDB || null;
    app.firebaseTools = window.firebaseTools || {};

    app.activityList = document.getElementById("activityList");
    app.tableBody = document.getElementById("submissionsTableBody");
    app.modal = document.getElementById("submissionModal");
    app.closeModalBtn = document.querySelector(".close-modal");
    app.searchInput = document.getElementById("searchSubmission");

    app.modalName = document.getElementById("modalName");
    app.modalEmail = document.getElementById("modalEmail");
    app.modalPhone = document.getElementById("modalPhone");
    app.modalArtist = document.getElementById("modalArtist");
    app.modalCountry = document.getElementById("modalCountry");
    app.modalStatus = document.getElementById("modalStatus");
    app.modalMessage = document.getElementById("modalMessage");
    app.adminNotes = document.getElementById("adminNotes");

    app.newLeadsCount = document.getElementById("newLeadsCount");
    app.contactedCount = document.getElementById("contactedCount");
    app.progressCount = document.getElementById("progressCount");
    app.completedCount = document.getElementById("completedCount");

    app.selectedSubmissionId = null;
    app.currentFilter = "all";

    app.submissionsCache = [];
    app.activitiesCache = [];

    app.unsubscribeSubmissions = null;
    app.unsubscribeActivities = null;

    app.getSubmissions = function () {
        return app.submissionsCache.slice();
    };

    app.getActivities = function () {
        return app.activitiesCache.slice();
    };

    app.getStatusClass = function (status) {
        const value = (status || "").toLowerCase();
        if (value.includes("contacted")) return "contacted";
        if (value.includes("completed")) return "completed";
        if (value.includes("rejected") || value.includes("serious")) return "rejected";
        return "new";
    };

    app.normalizeSubmission = function (item) {
        return {
            ...item,
            id: String(item.id || ""),
            name: item.name || "",
            email: item.email || "",
            artist: item.artist || "",
            phone: item.phone || "",
            country: item.country || "",
            countryCode: item.countryCode || "",
            message: item.message || "",
            status: item.status || "New",
            notes: item.notes || "",
            createdAt: item.createdAt || "",
            createdTimestamp: item.createdTimestamp || Date.now(),
            updatedAt: item.updatedAt || "",
            statusHistory: Array.isArray(item.statusHistory) ? item.statusHistory : []
        };
    };

    app.normalizeActivity = function (item) {
        return {
            ...item,
            id: String(item.id || ""),
            title: item.title || "",
            description: item.description || "",
            type: item.type || "new",
            createdAt: item.createdAt || "",
            createdTimestamp: item.createdTimestamp || Date.now()
        };
    };

    app.renderActivity = function () {
        if (!app.activityList) return;

        const activities = app.getActivities();

        app.activityList.innerHTML = activities.length
            ? activities.map((item) => `
                <div class="activity-item">
                    <div class="activity-dot ${item.type || "new"}"></div>
                    <div>
                        <strong>${item.title}</strong>
                        <p>${item.description}</p>
                        <small>${item.createdAt}</small>
                    </div>
                </div>
            `).join("")
            : `
                <div class="activity-item">
                    <p>No activity yet.</p>
                </div>
            `;
    };

    app.renderTable = function () {
        if (!app.tableBody) return;

        let submissions = app.getSubmissions();

        if (app.currentFilter !== "all") {
            submissions = submissions.filter((item) => item.status === app.currentFilter);
        }

        const searchTerm = app.searchInput?.value.toLowerCase().trim() || "";

        if (searchTerm) {
            submissions = submissions.filter(
                (item) =>
                    (item.name || "").toLowerCase().includes(searchTerm) ||
                    (item.artist || "").toLowerCase().includes(searchTerm) ||
                    (item.email || "").toLowerCase().includes(searchTerm)
            );
        }

        app.tableBody.innerHTML = submissions.length
            ? submissions.map((item) => `
                <tr>
                    <td>${item.name || ""}</td>
                    <td>${item.artist || ""}</td>
                    <td>${item.country || item.countryCode || ""}</td>
                    <td>
                        <span class="status ${app.getStatusClass(item.status)}">
                            ${item.status || "New"}
                        </span>
                    </td>
                    <td>${item.createdAt || ""}</td>
                    <td>
                        <button class="action-btn view-btn" type="button" data-id="${item.id}">
                            View
                        </button>
                    </td>
                </tr>
            `).join("")
            : `
                <tr>
                    <td colspan="6" style="padding: 24px; text-align: center; color: #64748b;">
                        No submissions yet.
                    </td>
                </tr>
            `;
    };

    app.updateStats = function () {
        const submissions = app.getSubmissions();

        const newCount = submissions.filter((item) => item.status === "New").length;
        const contactedCount = submissions.filter((item) => item.status === "Contacted").length;
        const progressCount = submissions.filter((item) => item.status === "In Progress").length;
        const completedCount = submissions.filter((item) => item.status === "Completed").length;

        if (app.newLeadsCount) app.newLeadsCount.textContent = newCount;
        if (app.contactedCount) app.contactedCount.textContent = contactedCount;
        if (app.progressCount) app.progressCount.textContent = progressCount;
        if (app.completedCount) app.completedCount.textContent = completedCount;
    };

    app.openModal = function (submission) {
        if (!app.modal || !submission) return;

        app.selectedSubmissionId = submission.id;

        if (app.modalName) app.modalName.textContent = submission.name || "-";
        if (app.modalEmail) app.modalEmail.textContent = submission.email || "-";
        if (app.modalPhone) app.modalPhone.textContent = submission.phone || "-";
        if (app.modalArtist) app.modalArtist.textContent = submission.artist || "-";
        if (app.modalCountry) app.modalCountry.textContent = submission.country || submission.countryCode || "-";
        if (app.modalStatus) app.modalStatus.textContent = submission.status || "New";
        if (app.modalMessage) app.modalMessage.textContent = submission.message || "-";
        if (app.adminNotes) app.adminNotes.value = submission.notes || "";

        app.modal.classList.add("is-open");
        app.modal.setAttribute("aria-hidden", "false");
    };

    app.closeModal = function () {
        if (!app.modal) return;

        app.modal.classList.remove("is-open");
        app.modal.setAttribute("aria-hidden", "true");
        app.selectedSubmissionId = null;
        app.currentFilter = "all";
    };

    app.subscribeToSubmissions = function () {
        if (!app.db || !app.firebaseTools.collection || !app.firebaseTools.onSnapshot) {
            console.warn("Firestore is not ready for submissions.");
            return;
        }

        const ref = app.firebaseTools.collection(app.db, "submissions");

        if (app.unsubscribeSubmissions) {
            app.unsubscribeSubmissions();
        }

        app.unsubscribeSubmissions = app.firebaseTools.onSnapshot(
            ref,
            (snapshot) => {
                const submissions = snapshot.docs
                    .map((d) => app.normalizeSubmission({
                        id: d.id,
                        ...d.data()
                    }))
                    .sort((a, b) => (b.createdTimestamp || 0) - (a.createdTimestamp || 0));

                app.submissionsCache = submissions;
                app.renderTable();
                app.updateStats();
            },
            (error) => {
                console.error("Failed to listen to submissions:", error);
            }
        );
    };

    app.subscribeToActivities = function () {
        if (!app.db || !app.firebaseTools.collection || !app.firebaseTools.onSnapshot) {
            console.warn("Firestore is not ready for activities.");
            return;
        }

        const ref = app.firebaseTools.collection(app.db, "activities");

        if (app.unsubscribeActivities) {
            app.unsubscribeActivities();
        }

        app.unsubscribeActivities = app.firebaseTools.onSnapshot(
            ref,
            (snapshot) => {
                const activities = snapshot.docs
                    .map((d) => app.normalizeActivity({
                        id: d.id,
                        ...d.data()
                    }))
                    .sort((a, b) => (b.createdTimestamp || 0) - (a.createdTimestamp || 0));

                app.activitiesCache = activities;
                app.renderActivity();
            },
            (error) => {
                console.error("Failed to listen to activities:", error);
            }
        );
    };

    app.saveSubmissions = async function (submissions) {
        const previousIds = new Set(app.submissionsCache.map((item) => String(item.id)));
        const normalized = submissions.map((item) => app.normalizeSubmission(item));
        const nextIds = new Set(normalized.map((item) => String(item.id)));

        app.submissionsCache = normalized;

        if (!app.db || !app.firebaseTools.doc || !app.firebaseTools.setDoc || !app.firebaseTools.deleteDoc) {
            return normalized;
        }

        try {
            const writes = normalized.map((item) =>
                app.firebaseTools.setDoc(
                    app.firebaseTools.doc(app.db, "submissions", String(item.id)),
                    item,
                    { merge: true }
                )
            );

            const deletions = Array.from(previousIds)
                .filter((id) => !nextIds.has(id))
                .map((id) =>
                    app.firebaseTools.deleteDoc(
                        app.firebaseTools.doc(app.db, "submissions", id)
                    )
                );

            await Promise.all([...writes, ...deletions]);
        } catch (error) {
            console.error("Failed to save submissions:", error);
        }

        return normalized;
    };

    app.addActivity = async function (title, description, type = "new") {
        const activity = app.normalizeActivity({
            title,
            description,
            type,
            createdAt: new Date().toLocaleString(),
            createdTimestamp: Date.now()
        });

        app.activitiesCache.unshift(activity);
        app.activitiesCache = app.activitiesCache.slice(0, 50);

        if (app.db && app.firebaseTools.addDoc && app.firebaseTools.collection) {
            try {
                await app.firebaseTools.addDoc(
                    app.firebaseTools.collection(app.db, "activities"),
                    activity
                );
            } catch (error) {
                console.error("Failed to save activity:", error);
            }
        }

        app.renderActivity();
        return activity;
    };

    if (app.tableBody) {
        app.tableBody.addEventListener("click", (event) => {
            const button = event.target.closest(".view-btn");
            if (!button) return;

            const id = String(button.dataset.id);
            const submission = app.getSubmissions().find((item) => String(item.id) === id);

            if (submission) app.openModal(submission);
        });
    }

    if (app.closeModalBtn) {
        app.closeModalBtn.addEventListener("click", app.closeModal);
    }

    if (app.modal) {
        app.modal.addEventListener("click", (event) => {
            if (event.target === app.modal) app.closeModal();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") app.closeModal();
    });

    if (app.searchInput) {
        app.searchInput.addEventListener("input", app.renderTable);
    }

    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((button) => button.classList.remove("active"));
            btn.classList.add("active");
            app.currentFilter = btn.dataset.filter;
            app.renderTable();
        });
    });

    app.subscribeToSubmissions();
    app.subscribeToActivities();
});