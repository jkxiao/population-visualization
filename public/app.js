import Country from "./Country.js";
import Bundle from "./Bundle.js";

const initDropdown = () => {
    let typeDropdown = document.querySelector("#type-dropdown").querySelector(".dropdown-content");
    let aggregatesButton = document.createElement("button");
    aggregatesButton.textContent = "Aggregates";
    aggregatesButton.dataset.type = "aggregates";
    aggregatesButton.addEventListener("click", onAggregatesButton);
    typeDropdown.appendChild(aggregatesButton);
    let regionsButton = document.createElement("button");
    regionsButton.textContent = "Regions";
    regionsButton.dataset.type = "regions";
    regionsButton.addEventListener("click", onRegionsButton);
    typeDropdown.appendChild(regionsButton);
    document.querySelector("#country-dropdown").querySelector(".dropdown-button").dataset.code = "";
};

const onAggregatesButton = async (event) => {
    let typeDropdown = document.querySelector("#type-dropdown");
    typeDropdown.querySelector(".dropdown-button").querySelector("p").textContent = "Aggregates";
    let regionDropdown = document.querySelector("#region-dropdown");
    regionDropdown.querySelector(".dropdown-button").querySelector("p").textContent = "Region";
    regionDropdown.querySelector(".dropdown-content").textContent = "";
    let countryDropdown = document.querySelector("#country-dropdown");
    let countryDropdownButton = countryDropdown.querySelector(".dropdown-button");
    countryDropdownButton.querySelector("p").textContent = "Country";
    countryDropdownButton.dataset.code = "";
    let countryDropdownContent = countryDropdown.querySelector(".dropdown-content");
    countryDropdownContent.textContent = "";
    let countries = await Country.listCountries({ type: "aggregates" });
    for (let country of countries) {
        let countryButton = document.createElement("button");
        countryButton.textContent = country.name;
        countryButton.dataset.code = country.code;
        countryButton.addEventListener("click", onCountryButton);
        countryDropdownContent.appendChild(countryButton);
    }
};

const onRegionsButton = async (event) => {
    let typeDropdown = document.querySelector("#type-dropdown");
    typeDropdown.querySelector(".dropdown-button").querySelector("p").textContent = "Regions";
    let regionDropdown = document.querySelector("#region-dropdown");
    regionDropdown.querySelector(".dropdown-button").querySelector("p").textContent = "Region";
    regionDropdown.querySelector(".dropdown-content").textContent = "";
    let countryDropdown = document.querySelector("#country-dropdown");
    let countryDropdownButton = countryDropdown.querySelector(".dropdown-button");
    countryDropdownButton.querySelector("p").textContent = "Country";
    countryDropdownButton.dataset.code = "";
    countryDropdown.querySelector(".dropdown-content").textContent = "";
    let regionDropdownContent = regionDropdown.querySelector(".dropdown-content");
    let regions = await Country.listRegions();
    for (let region of regions) {
        let regionButton = document.createElement("button");
        regionButton.dataset.region = regionButton.textContent = region;
        regionButton.addEventListener("click", onRegionButton);
        regionDropdownContent.appendChild(regionButton);
    }
};

const onRegionButton = async (event) => {
    let region = event.currentTarget.dataset.region;
    let regionDropdown = document.querySelector("#region-dropdown");
    regionDropdown.querySelector(".dropdown-button").querySelector("p").textContent = region
    let countryDropdown = document.querySelector("#country-dropdown");
    countryDropdown.querySelector(".dropdown-button").querySelector("p").textContent = "Country";
    let countryDropdownContent = countryDropdown.querySelector(".dropdown-content");
    countryDropdownContent.textContent = "";
    let countries = await Country.listCountries({ type: "regions", region });
    for (let country of countries) {
        let countryButton = document.createElement("button");
        countryButton.textContent = country.name;
        countryButton.dataset.code = country.code;
        countryButton.addEventListener("click", onCountryButton);
        countryDropdownContent.appendChild(countryButton);
    }
};

const onCountryButton = async (event) => {
    let target = event.currentTarget;
    let countryDropdownButton = document.querySelector("#country-dropdown").querySelector(".dropdown-button");
    countryDropdownButton.querySelector("p").textContent = target.textContent;
    countryDropdownButton.dataset.code = target.dataset.code;
};

const onAdd = async (event) => {
    let countryDropdownButton = document.querySelector("#country-dropdown").querySelector(".dropdown-button");
    let code = countryDropdownButton.dataset.code;
    if (code === "") return;
    countryDropdownButton.dataset.code = "";
    await bundle.append(code);
};

const onClear = async (event) => {
    bundle.clearCharts();
};

let years = [
    1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018
];
let defaultYear = 2018;

const initOptions = () => {
    let optionsContent = document.querySelector(".options-content");
    for (let year of years) {
        let optionButton = document.createElement("button");
        optionButton.textContent = year;
        optionButton.dataset.code = year;
        optionButton.addEventListener("click", onOptionButton);
        optionsContent.appendChild(optionButton);
    }
    optionsContent.querySelector(`[data-code="${defaultYear}"]`).classList.add("clicked");
    optionsContent.dataset.selected = defaultYear;
};

const onOptionButton = (event) => {
    let currentTarget = event.currentTarget;
    currentTarget.classList.add("clicked");
    let optionsContent = document.querySelector(".options-content");
    optionsContent.querySelector(`[data-code="${optionsContent.dataset.selected}"]`).classList.remove("clicked");
    optionsContent.dataset.selected = currentTarget.dataset.code;
    bundle.updateYear(currentTarget.dataset.code);
};

const initForm = async () => {
    let form = document.querySelector("#update-form");
    let codeSelect = form.code;
    let countries = await Country.listCountries();
    for (let country of countries) {
        let codeOption = document.createElement("option");
        codeOption.value = country.code;
        codeOption.textContent = country.code;
        codeSelect.appendChild(codeOption);
    }
    codeSelect.addEventListener("change", onCodeChange);
    let yearSelect = form.year;
    for (let year of years) {
        let yearOption = document.createElement("option");
        yearOption.value = year;
        yearOption.textContent = year;
        yearSelect.appendChild(yearOption);
    }
    yearSelect.addEventListener("change", onYearChange);
    form.data.readOnly = true;
    form.querySelector("#submit-form-button").addEventListener("click", onSubmitForm);
    form.querySelector("#clear-form-button").addEventListener("click", onClearForm);
};

const onCodeChange = async (event) => {
    let form = document.querySelector("#update-form");
    let codeSelect = form.code;
    let value = codeSelect.options[codeSelect.selectedIndex].value;
    if (value === "new") {
        form.newcode.classList.remove("hidden");
        formCountry = null;
        form.name.value = "";
        form.name.readOnly = false;
        form.region.value = "";
        form.region.readOnly = false;
        form.year.selectedIndex = 0;
        form.data.value = "";
        form.data.readOnly = true;
    } else {
        form.newcode.classList.add("hidden");
        formCountry = await Country.findCountry(value);    
        form.name.value = formCountry.name;
        form.name.readOnly = true;
        form.region.value = formCountry.region === "" ? "N/A" : formCountry.region;
        form.region.readOnly = true;
        form.year.selectedIndex = 0;
        form.data.value = "";
        form.data.readOnly = true;
    }
}

const onYearChange = (event) => {
    let form = document.querySelector("#update-form");
    let yearSelect = form.year;
    let value = yearSelect.options[yearSelect.selectedIndex].value;
    if (value === "none") {
        form.data.value = "";
        form.data.readOnly = true;
        return;
    };
    if (formCountry === null) {
        form.data.value = "";
        form.data.readOnly = false;
    } else {
        form.data.value = formCountry.population[value];
        form.data.readOnly = false;
    }
}

const onSubmitForm = async (event) => {
    event.preventDefault();
    let form = document.querySelector("#update-form");
    let yearSelect = form.year;
    let year = yearSelect.options[yearSelect.selectedIndex].value;
    let population = Number.parseInt(form.data.value);
    if (formCountry === null) {
        let code = form.newcode.value;
        let countries = await Country.listCountries();
        for (let country of countries) {
            if (code === "") {
                alert(`Code cannot be empty`)
                return;
            }
            if (code === country.code) {
                alert(`Code already exists`)
                return;
            }
        }
        let name = form.name.value;
        let region = form.region.value;
        let entry = {code, name, region};
        if (year !== "none") {
            if (Number.isNaN(population)) {
                alert(`Population must be a number`)
                return;
            }
            entry.year = year;
            entry.population = population;
        }
        await Country.createEntry(entry);
    } else {
        if (year === "none") {
            alert(`Please select a year`)
            return;
        }
        if (Number.isNaN(population)) {
            alert(`Population must be a number`)
            return;
        }
        await Country.updateData(formCountry.code, year, population);
    }
    form.reset();
}

const onClearForm = (event) => {
    event.preventDefault();
    document.querySelector("#update-form").reset();
}

let bundle;
let formCountry = null;

const main = async () => {
    initOptions();
    initDropdown();
    initForm();
    bundle = new Bundle(document.querySelector("#bar-chart"), document.querySelector("#line-chart"));
    document.querySelector("#add-button").addEventListener("click", onAdd);
    document.querySelector("#clear-button").addEventListener("click", onClear);
};

main();