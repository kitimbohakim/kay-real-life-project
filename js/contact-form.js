import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const form =
        document.getElementById("contactPageForm") ||
        document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        try {
            const db = window.firebaseDB;
            if (!db) throw new Error("Firebase DB not ready");

            const formData = new FormData(form);

            console.log("========== FORM DEBUG ==========");
            console.log("FORM ID:", form.id);

            console.log("NAME:", formData.get("name"));
            console.log("EMAIL:", formData.get("email"));
            console.log("ARTIST:", formData.get("artist"));
            console.log("COUNTRY CODE:", formData.get("countryCode"));
            console.log("PHONE:", formData.get("phone"));
            console.log("MESSAGE:", formData.get("message"));

            const selectedCountry =
                form.querySelector(".country-option.selected");

            const country =
                selectedCountry?.dataset?.country ||
                selectedCountry?.textContent?.trim()?.split("\n")[0] ||
                "Unknown";

            const submissionData = {
                name: formData.get("name")?.trim() || "",
                email: formData.get("email")?.trim() || "",
                artist: formData.get("artist")?.trim() || "",
                country,
                countryCode: formData.get("countryCode") || "",
                phone: formData.get("phone")?.trim() || "",
                message: formData.get("message")?.trim() || "",

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

            console.log("SUBMISSION DATA:");
            console.log(submissionData);
            console.log("===============================");

            await addDoc(collection(db, "submissions"), submissionData);

            await addDoc(collection(db, "activities"), {
                title: "New Submission",
                description: `${submissionData.artist || submissionData.name} submitted a request`,
                type: "new",
                createdAt: new Date().toLocaleString(),
                createdTimestamp: Date.now()
            });

            alert("Thank you! Your submission has been received.");
            form.reset();
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Something went wrong. Please try again.");
        }

        submitBtn.disabled = false;
        submitBtn.textContent = "Join Early Access →";
    });
});