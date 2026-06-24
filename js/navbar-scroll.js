window.addEventListener("load", () => {
    const header = document.querySelector(".header");
    if (!header) return;

    let lastScroll = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll <= 20) {
            header.classList.remove("header-hidden");
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll > lastScroll) {
            // scrolling down -> hide
            header.classList.add("header-hidden");
        } else {
            // scrolling up -> show
            header.classList.remove("header-hidden");
        }

        lastScroll = currentScroll;
    }, { passive: true });
});