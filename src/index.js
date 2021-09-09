function formatHour(timestemp) {
  let date = new Date(timestemp);
  let currentHours = date.getHours();
  let currentMinutes = date.getMinutes();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  return ` ${currentHours}:${currentMinutes}`;
}
function formatDay(timestemp) {
  let date = new Date(timestemp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function formatDate(timestemp) {
  let date = new Date(timestemp);
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
  let currentDate = date.getDate();
  let months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  let currentMonth = months[date.getMonth()];

  if (currentDate < 10) {
    currentDate = `0${currentDate}`;
  }
  if (currentMonth < 10) {
    currentMonth = `0${currentMonth}`;
  }

  return `${currentDay} ${currentDate}/${currentMonth}`;
}
function getForecast(coordinates) {
  let apiKey = "16830bfc1e47231d3a538e2cfef02d61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  let cityInfo = document.querySelector(".city");
  cityInfo.innerHTML = response.data.name;
  let countryInfo = document.querySelector(".country");
  countryInfo.innerHTML = response.data.sys.country;
  celsiusTemperature = Math.round(response.data.main.temp);
  let temperatureInfo = document.querySelector(".temperature");
  temperatureInfo.innerHTML = celsiusTemperature;
  let feelslikeInfo = document.querySelector("#feels-like");
  feelslikeInfo.innerHTML = Math.round(response.data.main.feels_like);
  let maxInfo = document.querySelector("#maximum");
  maxInfo.innerHTML = Math.round(response.data.main.temp_max);
  let minInfo = document.querySelector("#minimum");
  minInfo.innerHTML = Math.round(response.data.main.temp_min);
  let humidityInfo = document.querySelector("#humidity");
  humidityInfo.innerHTML = Math.round(response.data.main.humidity);
  let windInfo = document.querySelector("#wind");
  windInfo.innerHTML = Math.round(response.data.wind.speed);
  let dateInfo = document.querySelector(".current-day");
  dateInfo.innerHTML = formatDate(response.data.dt * 1000);
  let updateInfo = document.querySelector(".last-updated-hour");
  updateInfo.innerHTML = formatHour(response.data.dt * 1000);
  let iconInfo = document.querySelector("#icon");
  iconInfo.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}
function showDescription(response) {
  let descriptionInfo = document.querySelector(".description");
  let description = response.data.weather[0].main;
  descriptionInfo.innerHTML = description;
  if (
    description === "Rain" ||
    description === "Thunderstorm" ||
    description === "Drizzle"
  ) {
    document.getElementById("weather-app").style.backgroundImage =
      "linear-gradient(to bottom, #9fa8b1 0%, #c3cbda 52%, #ebebeb 100%)";
    document.body.style.backgroundImage = "url(media/rain.jpg)";
  } else if (description === "Clouds") {
    document.getElementById("weather-app").style.backgroundImage =
      "linear-gradient(to top, #fcd9be 0%, #aed9fc 100%)";
    document.body.style.backgroundImage = "url(media/clouds.jpg)";
  } else if (description === "Clear") {
    document.getElementById("weather-app").style.backgroundImage =
      "linear-gradient(to top, #fcd9be 0%, #aed9fc 100%)";
    document.body.style.backgroundImage = "url(media/clear.jpg)";
  } else if (
    description === "Mist" ||
    description === "Smoke" ||
    description === "Fog" ||
    description === "Haze" ||
    description === "Dust" ||
    description === "Sand" ||
    description === "Ash"
  ) {
    document.getElementById("weather-app").style.backgroundImage =
      "linear-gradient(to bottom, #9fa8b1 0%, #c3cbda 52%, #ebebeb 100%)";
    document.body.style.backgroundImage = "url(media/fog.jpg)";
  } else if (description === "Snow") {
    document.getElementById("weather-app").style.backgroundImage =
      "linear-gradient(to bottom, #9fa8b1 0%, #c3cbda 52%, #ebebeb 100%)";
    document.body.style.backgroundImage = "url(media/snow.jpg)";
  }
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastInfo = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
      <div class="forecast-days">${formatDay(forecastDay.dt)}</div>
      <div><img src= "https://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" alt="" width ="55" /></div>
      <span class="forecast-temperature-max">${Math.round(
        forecastDay.temp.max
      )}°</span>/<span
                  class="forecast-temperature-min"
                  >${Math.round(forecastDay.temp.min)}º</span
                  >
                  </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;

  forecastInfo.innerHTML = forecastHTML;
}
function showCity(city) {
  let apiKey = "16830bfc1e47231d3a538e2cfef02d61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
  axios.get(apiUrl).then(showDescription);
}
function showPosition(position) {
  let apiKey = "16830bfc1e47231d3a538e2cfef02d61";
  let apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function showCurrentcity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  showCity(city);
}
let searchcityForm = document.querySelector("#search-form");
searchcityForm.addEventListener("submit", handleSubmit);

let currentcityButton = document.querySelector("#current-button");
currentcityButton.addEventListener("click", showCurrentcity);

showCity("Lisbon, PT");
