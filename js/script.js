const apiKey = "";
const apiUnsplash = "https://api.unsplash.com/search/photos?query=";
const apiKeyUnsplash = "";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");
const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

//Funtions
const toggleLoader = () => {
    loader.classList.toggle("hide");
};

const getWeatherData = async (city) => {
    toggleLoader();
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=en`;
    const res = await fetch(apiWeatherURL);
    const data = await res.json();
    toggleLoader();
    return data;
}

const getCityImage = async (city) => {
    const url = `${apiUnsplash}${encodeURIComponent(city)}&client_id=${apiKeyUnsplash}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results.length > 0) {
            return data.results[0].urls.regular;
        } else {
            console.warn(`Nenhuma imagem encontrada para ${city}`);
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar imagem:", error);
        return null;
    }
};

const showErrorMessage = () => {
    errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
    errorMessageContainer.classList.add("hide");
    weatherContainer.classList.add("hide");
    suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
    hideInformation();
    const data = await getWeatherData(city);

    if (data.cod === "404") {
        showErrorMessage();
        return;
      }

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    const apiCountryURL = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
    countryElement.setAttribute("src", apiCountryURL);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed}km/h`;
    
    const cityImageUrl = await getCityImage(city);
    if (cityImageUrl) {
        document.body.style.backgroundImage = `url("${cityImageUrl}")`;
    } else {
        document.body.style.backgroundImage = "none";
    }

    weatherContainer.classList.remove("hide");
}


//Events
searchBtn.addEventListener("click", (e)=> {
    e.preventDefault();
    const city = cityInput.value;
    showWeatherData(city)
});

cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value;
        showWeatherData(city);
    }
});

suggestionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = btn.getAttribute("id");
  
      showWeatherData(city);
    });
});
