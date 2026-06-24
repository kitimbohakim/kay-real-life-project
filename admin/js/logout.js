document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem(
            "krl_logged_in"
        );

        window.location.href =
            "login.html";

    });

});