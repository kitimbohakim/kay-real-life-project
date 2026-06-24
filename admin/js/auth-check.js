document.addEventListener("DOMContentLoaded", () => {

    const isLoggedIn =
        localStorage.getItem("krl_logged_in");

    if (isLoggedIn !== "true") {

        window.location.href =
            "login.html";

    }

});

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (e) => {

        e.preventDefault();

        localStorage.removeItem(
            "krl_logged_in"
        );

        window.location.href =
            "login.html";

    });

});