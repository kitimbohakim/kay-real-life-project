async function loadComponent(id, filePath) {
    const mountPoint = document.getElementById(id);
    if (!mountPoint) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        mountPoint.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
        mountPoint.innerHTML = `<div style="padding:16px;color:#8a4b4b">Could not load ${filePath}</div>`;
    }
}

function ensureFontAwesome() {
    if (document.querySelector('link[data-fontawesome="true"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    link.setAttribute("data-fontawesome", "true");
    document.head.appendChild(link);
}

function applyDynamicLinks() {
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const basePath = isInPagesFolder ? "../" : "";

    document.querySelectorAll("[data-link]").forEach((el) => {
        const target = el.getAttribute("data-link");
        el.setAttribute("href", basePath + target);
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    ensureFontAwesome();

    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const basePath = isInPagesFolder ? "../" : "";

    await loadComponent("site-header", `${basePath}components/header.html?v=2`);
    await loadComponent("site-footer", `${basePath}components/footer.html?v=2`);

    applyDynamicLinks();
});

window.addEventListener("DOMContentLoaded", async () => {

    ensureFontAwesome();

    const isInPagesFolder =
        window.location.pathname.includes("/pages/");

    const basePath = isInPagesFolder ? "../" : "";

    await loadComponent(
        "site-header",
        `${basePath}components/header.html?v=2`
    );

    await loadComponent(
        "site-footer",
        `${basePath}components/footer.html?v=2`
    );

    applyDynamicLinks();

    // MOBILE MENU

    const menuToggle =
        document.getElementById("menuToggle");

    const navigation =
        document.getElementById("navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            navigation.classList.toggle("active");

            menuToggle.innerHTML =
                navigation.classList.contains("active")
                    ? "✕"
                    : "☰";

        });

    }

});