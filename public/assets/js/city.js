var selectCountry = document.getElementById("country-select");

axios.get('https://restcountries.eu/rest/v2/all').then(respone => {
    respone.data.forEach(c => {
        var option = document.createElement("option");
        option.text = c.name;
        option.value = c.alpha2Code;
        selectCountry.appendChild(option);
    })
})