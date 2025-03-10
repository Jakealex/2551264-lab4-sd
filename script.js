document.getElementById("search-button").addEventListener("click", fetchCountryData);
//gets the input country and puts in a variabvle 
async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();
    if (!countryName) {
        alert("Please enter a country name."); //error handling poart 
        return;
    }
// creates variablks for html sections for countrey and brdr country
    const countryInfoSection = document.getElementById("country-info");
    const borderingCountriesSection = document.getElementById("bordering-countries");
//clears after each use
    countryInfoSection.innerHTML = "";
    borderingCountriesSection.innerHTML = "";
// access url to get infgo for site
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
//errorr handling agion lol
        if (!response.ok) {
            throw new Error("Country not found.");
        }
// getting data and parsing it into json
        const countryData = await response.json();
        const country = countryData[0];
// all vars needed for data
        const capital = country.capital ? country.capital[0] : "No capital available";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flagUrl = country.flags.svg || country.flags.png;
        const borders = country.borders || [];
// writing into html
        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flagUrl}" alt="Flag of ${country.name.common}" width="200">
        `;
// collecting border vountries if length more than zero has broderr cntries
        if (borders.length > 0) {
            const borderPromises = borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => res.json())
                    .then(data => ({
                        name: data[0].name.common,
                        flag: data[0].flags.svg || data[0].flags.png
                    }))
            );
//do with getting border cntries
            const borderingCountries = await Promise.all(borderPromises);

            borderingCountriesSection.innerHTML = `<h3>Bordering Countries:</h3>`;
            borderingCountries.forEach(country => {
                borderingCountriesSection.innerHTML += `
                    <p>${country.name}</p>
                    <img src="${country.flag}" alt="Flag of ${country.name}" width="100">
                `;
            });
        } else {
            borderingCountriesSection.innerHTML = "<p>No bordering countries.</p>";
        }
// errors again 
    } catch (error) {
        countryInfoSection.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}
