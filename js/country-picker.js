document.addEventListener("DOMContentLoaded", async () => {

    try {

        const countryFile =
            window.location.pathname.includes("/pages/")
                ? "../js/countries.json"
                : "js/countries.json";

        const response = await fetch(countryFile);

        if (!response.ok) {
            throw new Error("Unable to load countries.json");
        }

        const countries = await response.json();

        document.querySelectorAll("[data-country-picker]").forEach((picker) => {

            const button = picker.querySelector(".country-button");
            const dropdown = picker.querySelector(".country-dropdown");

            const hiddenInput =
                picker.querySelector('input[name="countryCode"]');

            const flag =
                picker.querySelector(".country-flag");

            const code =
                picker.querySelector(".country-code-text");

            dropdown.innerHTML = `
    <div class="country-search">
        <input
            class="country-search-input"
            type="text"
            placeholder="Search country...">
    </div>

    <div class="country-list"></div>
`;

            const searchInput =
                dropdown.querySelector(".country-search-input");

            const countryList =
                dropdown.querySelector(".country-list");

            countries.forEach(country => {

                const name =
                    country.name?.common || country.name;

                const callingCode =
                    country.idd?.root && country.idd?.suffixes?.length
                        ? country.idd.root + country.idd.suffixes[0]
                        : "";

                if (!callingCode) return;

                const flagEmoji =
                    country.flag || "🏳️";

                const item =
                    document.createElement("button");

                item.type = "button";

                item.className = "country-option";

                item.dataset.country = name;
                item.dataset.code = callingCode;
                item.dataset.flag = flagEmoji;

                item.innerHTML = `
                    <span class="option-left">
                        <span class="option-flag">${flagEmoji}</span>
                        ${name}
                    </span>

                    <span class="option-code">
                        ${callingCode}
                    </span>
                `;

                item.addEventListener("click", () => {

                    dropdown
                        .querySelectorAll(".country-option")
                        .forEach(btn => btn.classList.remove("selected"));

                    item.classList.add("selected");

                    flag.textContent = flagEmoji;

                    code.textContent = callingCode;

                    hiddenInput.value = callingCode;

                    picker.classList.remove("is-open");

                });

                countryList.appendChild(item);

            });

            searchInput.addEventListener("input", () => {

                const value =
                    searchInput.value.toLowerCase();

                countryList
                    .querySelectorAll(".country-option")
                    .forEach(option => {

                        const name =
                            option.dataset.country.toLowerCase();

                        const code =
                            option.dataset.code.toLowerCase();

                        option.style.display =
                            name.includes(value) ||
                                code.includes(value)
                                ? "flex"
                                : "none";

                    });

            });

            const uganda =
                dropdown.querySelector('[data-country="Uganda"]');

            if (uganda) {

                uganda.classList.add("selected");

                flag.textContent =
                    uganda.dataset.flag;

                code.textContent =
                    uganda.dataset.code;

                hiddenInput.value =
                    uganda.dataset.code;

            }

            button.addEventListener("click", () => {

                picker.classList.toggle("is-open");

            });

        });

        document.addEventListener("click", (e) => {

            document
                .querySelectorAll("[data-country-picker]")
                .forEach((picker) => {

                    if (!picker.contains(e.target)) {

                        picker.classList.remove("is-open");

                    }

                });

        });

    } catch (error) {

        console.error("Country Picker:", error);

    }

});