//time and date
let currentTime = new Date();
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[date.getDay()];
  let todaysDate = date.getDate();
  let year = date.getFullYear();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  return `${currentDay} ${todaysDate}, ${year} ${hour}:${minute}`;
}
let date = document.querySelector("#date");
date.innerHTML = formatDate(currentTime);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "019a04bff250cd68f1279afbaabd37a6";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiURL).then(displayForecast);
}

//conversion
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = 0;
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = 0;
}

let fahrenheitLink = document.querySelector("#fahrenheit-conversion");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-conversion");
celsiusLink.addEventListener("click", convertToCelsius);

//search engine
function capitalize(city) {
  return city && city[0].toUpperCase() + city.slice(1);
}

function replaceText(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input");
  let h1 = document.querySelector("h1");
  let searchDate = document.querySelector(".date");
  let capitalCity = capitalize(city.value);
  h1.innerHTML = `${capitalCity}`;
  searchDate.innerHTML = `${currentTime}`;
}

let buttonClick = document.querySelector("#search-button");
buttonClick.addEventListener("click", replaceText);

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let humidity = Math.round(response.data.main.humidity);
  let wind = Math.round(response.data.wind.speed);
  let cityName = response.data.name;
  let currentTemp = document.querySelector("#current-temperature");
  let currentHumidity = document.querySelector("#humidity");
  let currentWindSpeed = document.querySelector("#wind");
  let city = document.querySelector("#city-search");
  city.innerHTML = `${cityName}`;
  currentTemp.innerHTML = `${temperature}°`;
  currentHumidity.innerHTML = `${humidity}%`;
  currentWindSpeed.innerHTML = `${wind} mph`;
  let iconElement = document.querySelector("#icon");

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function geoPosition(response) {
  let longitude = response.coords.longitude;
  let latitude = response.coords.latitude;
  let apiKey = "019a04bff250cd68f1279afbaabd37a6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
navigator.geolocation.getCurrentPosition(geoPosition);

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(geoPosition);
}

let currentLocation = document.querySelector("#location-button");
currentLocation.addEventListener("click", getPosition);

function citySearch(response) {
  let city = document.getElementById("search-input").value;
  city = city.toLowerCase();
  let apiKey = "019a04bff250cd68f1279afbaabd37a6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

let cityInput = document.querySelector("#search-input");
cityInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    document.querySelector("#search-button").click();
  }
});

let searchLocation = document.querySelector("#search-button");
searchLocation.addEventListener("click", citySearch);
