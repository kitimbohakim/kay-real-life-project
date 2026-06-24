document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const error =
            document.getElementById("loginError");

        if (
            username === "kayrealadmin" &&
            password === "Kato@rama"
        ) {

            localStorage.setItem(
                "krl_logged_in",
                "true"
            );

            window.location.href =
                "dashboard.html";

        } else {

            error.textContent =
                "Invalid username or password.";

        }

    });

});

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem(
            "krl_logged_in"
        );

        window.location.href =
            "login.html";

    });

}

const showPassword =
    document.getElementById("showPassword");

const passwordField =
    document.getElementById("password");

showPassword.addEventListener("change", () => {

    passwordField.type =
        showPassword.checked
            ? "text"
            : "password";

});