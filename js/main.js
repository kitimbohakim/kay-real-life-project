document.addEventListener("DOMContentLoaded", () => {

    const header =
        document.querySelector(".header");

    if (!header) return;

    function setScrolledState() {

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 20
        );

    }

    window.addEventListener(
        "scroll",
        setScrolledState,
        { passive: true }
    );

    setScrolledState();

});

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            navigation.classList.toggle("active");

            if (navigation.classList.contains("active")) {
                menuToggle.innerHTML = "✕";
            } else {
                menuToggle.innerHTML = "☰";
            }

        });

    }

});
