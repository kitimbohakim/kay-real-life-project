document.addEventListener("DOMContentLoaded", () => {
    const formIds = ["contactPageForm", "contactForm", "joinForm"];
    const forms = formIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if (!forms.length) return;

    forms.forEach((form) => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            const originalButtonText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            try {
                const db = window.firebaseDB;
                const tools = window.firebaseTools || {};
                const collection = tools.collection;
                const addDoc = tools.addDoc;

                if (!db || !collection || !addDoc) {
                    throw new Error("Firebase is not ready");
                }

                const formData = new FormData(form);
                const picker = form.querySelector("[data-country-picker]");
                const selectedCountry = picker?.querySelector(".country-option.selected");

                const country =
                    selectedCountry?.dataset?.country ||
                    "Unknown";

                const source =
                    form.id === "joinForm"
                        ? "Early Access"
                        : form.id === "contactForm"
                            ? "Home Contact"
                            : "Contact Page";

                const submissionData = {
                    name: formData.get("name")?.trim() || "",
                    email: formData.get("email")?.trim() || "",
                    artist: formData.get("artist")?.trim() || "",
                    country,
                    countryCode: formData.get("countryCode") || "",
                    phone: formData.get("phone")?.trim() || "",
                    message: formData.get("message")?.trim() || "",
                    source,
                    status: "New",
                    notes: "",
                    createdAt: new Date().toLocaleDateString(),
                    createdTimestamp: Date.now(),
                    updatedAt: "",
                    statusHistory: [
                        {
                            status: "New",
                            at: new Date().toLocaleString()
                        }
                    ]
                };

                await addDoc(collection(db, "submissions"), submissionData);

                await addDoc(collection(db, "activities"), {
                    title: `New ${source}`,
                    description: `${submissionData.artist || submissionData.name} submitted a ${source.toLowerCase()} request`,
                    type: "new",
                    source,
                    createdAt: new Date().toLocaleString(),
                    createdTimestamp: Date.now()
                });

                alert("Thank you! Your submission has been received.");
                form.reset();

                form.querySelectorAll("[data-country-picker]").forEach((pickerEl) => {
                    if (typeof pickerEl._resetCountryPicker === "function") {
                        pickerEl._resetCountryPicker();
                    }
                });
            } catch (error) {
                console.error("Submission Error:", error);
                alert("Something went wrong. Please try again.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalButtonText;
            }
        });
    });
});