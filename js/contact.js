document.addEventListener("DOMContentLoaded", () => {
    const picker = document.querySelector("[data-country-picker]");
    if (!picker) return;

    const button = picker.querySelector(".country-button");
    const dropdown = picker.querySelector(".country-dropdown");
    const hiddenInput = document.getElementById("countryCode");
    const flagEl = picker.querySelector(".country-flag");
    const codeTextEl = picker.querySelector(".country-code-text");
    const options = Array.from(picker.querySelectorAll(".country-option"));

    function setCountryByCode(code) {
        const option = options.find((item) => item.dataset.code === code);
        const fallback = options.find((item) => item.dataset.code === "+256");
        const selected = option || fallback;

        if (!selected) return;

        flagEl.textContent = selected.dataset.flag || "🇺🇬";
        codeTextEl.textContent = selected.dataset.code || "+256";
        hiddenInput.value = selected.dataset.code || "+256";
    }

    function openPicker() {
        picker.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
    }

    function closePicker() {
        picker.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
    }

    function togglePicker() {
        picker.classList.contains("is-open") ? closePicker() : openPicker();
    }

    setCountryByCode("+256");

    button.addEventListener("click", (e) => {
        e.preventDefault();
        togglePicker();
    });

    options.forEach((option) => {
        option.addEventListener("click", () => {
            setCountryByCode(option.dataset.code);
            closePicker();
        });
    });

    document.addEventListener("click", (event) => {
        if (!picker.contains(event.target)) closePicker();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closePicker();
    });
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const formData = new FormData(contactForm);

        const submission = {
            id: Date.now(),
            name: formData.get("name"),
            email: formData.get("email"),
            artist: formData.get("artist"),
            phone: formData.get("phone"),
            countryCode: formData.get("countryCode"),
            message: formData.get("message"),
            status: "New",
            createdAt: new Date().toLocaleDateString()
        };

        const submissions =
            JSON.parse(localStorage.getItem("krl_submissions")) || [];

        submissions.unshift(submission);

        localStorage.setItem(
            "krl_submissions",
            JSON.stringify(submissions)
        );

        alert("Thank you! Your submission has been received.");

        contactForm.reset();

        const countryCodeInput = document.getElementById("countryCode");

        if (countryCodeInput) {
            countryCodeInput.value = "+256";
        }

    });

}