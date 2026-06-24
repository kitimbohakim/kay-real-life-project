import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("contactPageForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn =
            form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        try {

            const db = window.firebaseDB;

            const formData = new FormData(form);

            const selectedCountry =
                document.querySelector(
                    ".country-option.selected"
                );

            const country =
                selectedCountry?.textContent
                    ?.trim()
                    ?.split("\n")[0] ||
                "Unknown";

            const submissionData = {

                name: formData.get("name") || "",
                email: formData.get("email") || "",
                artist: formData.get("artist") || "",
                country: country,
                countryCode: formData.get("countryCode") || "",
                phone: formData.get("phone") || "",
                message: formData.get("message") || "",

                status: "New",
                notes: "",

                createdAt:
                    new Date().toLocaleDateString(),

                createdTimestamp:
                    Date.now(),

                updatedAt: "",

                statusHistory: [
                    {
                        status: "New",
                        at: new Date().toLocaleString()
                    }
                ]

            };

            await addDoc(
                collection(db, "submissions"),
                submissionData
            );

            await addDoc(
                collection(db, "activities"),
                {
                    title: "New Submission",
                    description:
                        `${submissionData.artist || submissionData.name} submitted a request`,
                    type: "new",
                    createdAt:
                        new Date().toLocaleString(),
                    createdTimestamp:
                        Date.now()
                }
            );

            alert(
                "Thank you! Your submission has been received."
            );

            form.reset();

        } catch (error) {

            console.error(
                "Submission Error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        }

        submitBtn.disabled = false;
        submitBtn.textContent =
            "Join Early Access →";

    });

}