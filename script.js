const userTab = document.getElementById("user-weather");
const searchTab = document.getElementById("search-weather");
const userContainer = document.querySelector(".container-weather"); // Accessing first element of the HTMLCollection

const grant = document.querySelector(".grant-access"); // Accessing first element of the HTMLCollection
const searchForm = document.querySelector(".container-form");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".weather-info"); // Accessing first element of the HTMLCollection

let APIkey = "d433b1a65e2e0d62d484c4a745ff474c";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

// Switch tab function
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
  }

  if (!searchForm.classList.contains("active")) {
    userInfoContainer.classList.remove("active");
    grant.classList.remove("active");
    searchForm.classList.add("active");
  } else {
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    getFromSessionStorage();
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getFromSessionStorage() {
  const localCoordinate = sessionStorage.getItem("user-coordinates");
  if (!localCoordinate) {
    grant.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinate);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grant.classList.remove("active");
  loadingScreen.classList.add("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (e) {
    loadingScreen.classList.remove("active");
    console.log(e);
    // You might want to add error handling here, such as displaying an error message
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.getElementById("city-name");
  const country_icon = document.getElementById("country-icon");
  const desc = document.getElementById("weather-desc");
  const weather_icon = document.getElementById("weather-icon");
  const temp = document.getElementById("data-temp");
  const windspeed = document.getElementById("windspeed");
  const humidity = document.getElementById("humidity");
  const cloud = document.getElementById("cloud");

  cityName.innerText = weatherInfo?.name;
  country_icon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weather_icon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloud.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("geoLocation is not supported");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grant_button = document.getElementById("btn-1");
grant_button.addEventListener("click", getLocation);

const searchInput = document.getElementById("search");
const search_button = document.getElementById("search-button");
search_button.addEventListener("click", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName); // Wait for the completion of fetchSearchWeatherInfo
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grant.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (e) {
    loadingScreen.classList.remove("active");
    console.log(e);
    // You might want to add error handling here, such as displaying an error message
  }
}
