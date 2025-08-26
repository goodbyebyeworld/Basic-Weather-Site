const API_KEY = "feb534ac5fdd4ca0b7b161330252408";

const searchBox = document.getElementById("searchBox");
const cityInput = document.getElementById("cityInput");
const errorBox = document.getElementById("errorBox");
const loading = document.getElementById("loading");
const weatherBox = document.getElementById("weatherBox");

const weatherCity = document.getElementById("weatherCity");
const weatherIcon = document.getElementById("weatherIcon");
const weatherTemp = document.getElementById("weatherTemp");
const weatherDesc = document.getElementById("weatherDesc");
const weatherHumidity = document.getElementById("weatherHumidity");
const weatherWind = document.getElementById("weatherWind");

// ===== SETTINGS (User Preferences) =====
function getSettings() {
  return JSON.parse(localStorage.getItem("settings")) || {};
}

function saveSettings(settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}

function setUnits(units) {
  let settings = getSettings();
  settings.units = units;
  saveSettings(settings);

  // API'yi tekrar çağırma → sadece cache edilmiş veriyi göster
  if (window._lastWeatherData) {
    showWeather(window._lastWeatherData);
  }
}

function getUnits() {
  let settings = getSettings();
  return settings.units || "metric"; // Default: metric (°C)
}

// ===== UI Helpers =====
function toggleSearch() {
  const isVisible = searchBox.style.display === "block";
  searchBox.style.display = isVisible ? "none" : "block";
  cityInput.focus();
  showSearchHistory();
}

function showError(message) {
  errorBox.innerText = message;
  errorBox.style.display = "block";
  setTimeout(() => {
    errorBox.style.display = "none";
  }, 4000);
}

function showLoading(isLoading) {
  loading.style.display = isLoading ? "block" : "none";
  if (isLoading) {
    weatherBox.style.display = "none";
    errorBox.style.display = "none";
  }
}

// ===== WEATHER DISPLAY =====
function showWeather(data) {
  const units = getUnits();

  weatherCity.innerText = `${data.location.name}, ${data.location.country}`;
  weatherIcon.src = data.current.condition.icon;
  weatherIcon.alt = data.current.condition.text;

  // Temperature display depending on unit
  if (units === "metric") {
    weatherTemp.innerText = `Temperature: ${data.current.temp_c} °C`;
  } else if (units === "imperial") {
    weatherTemp.innerText = `Temperature: ${data.current.temp_f} °F`;
  } else if (units === "kelvin") {
    const kelvin = Math.round(data.current.temp_c + 273.15);
    weatherTemp.innerText = `Temperature: ${kelvin} K`;
  }

  weatherDesc.innerText = `Weather: ${capitalizeFirstLetter(data.current.condition.text)}`;
  weatherHumidity.innerText = `Humidity: ${data.current.humidity}%`;
  weatherWind.innerText = `Wind Speed: ${(data.current.wind_kph / 3.6).toFixed(1)} m/s`;

  weatherBox.style.display = "block";
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// ===== API CALLS =====
function fetchWeatherByCity(city) {
  showLoading(true);

  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("City not found.");
      return res.json();
    })
    .then((data) => {
      let settings = getSettings();
      settings.lastCity = data.location.name;
      saveSettings(settings);

      window._lastWeatherData = data; // 🔹 cache
      showWeather(data);
    })
    .catch((err) => {
      showError(err.message);
    })
    .finally(() => {
      showLoading(false);
    });
}

function fetchWeatherByCoords(lat, lon) {
  showLoading(true);

  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch weather for your location.");
      return res.json();
    })
    .then((data) => {
      let settings = getSettings();
      settings.lastCity = data.location.name;
      saveSettings(settings);

      window._lastWeatherData = data; // 🔹 cache
      showWeather(data);
    })
    .catch((err) => {
      showError(err.message);
    })
    .finally(() => {
      showLoading(false);
    });
}

// ===== SEARCH HISTORY =====
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function saveSearchHistory(city) {
  let history = getSearchHistory();
  city = city.trim();
  if (!city) return;

  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  if (history.length > 5) history.pop();

  localStorage.setItem("searchHistory", JSON.stringify(history));
}

function showSearchHistory() {
  let history = getSearchHistory();
  if (history.length === 0) {
    searchHistoryDiv.style.display = "none";
    return;
  }

  const filterVal = cityInput.value.toLowerCase();
  let filteredHistory = history.filter((city) =>
    city.toLowerCase().includes(filterVal)
  );

  if (filteredHistory.length === 0) {
    searchHistoryDiv.style.display = "none";
    return;
  }

  searchHistoryDiv.innerHTML = "";
  filteredHistory.forEach((city) => {
    const div = document.createElement("div");
    div.textContent = city;
    div.onclick = () => {
      cityInput.value = city;
      searchCity();
      searchHistoryDiv.style.display = "none";
    };
    searchHistoryDiv.appendChild(div);
  });
  searchHistoryDiv.style.display = "block";
}

cityInput.addEventListener("focus", showSearchHistory);
cityInput.addEventListener("input", showSearchHistory);

function searchCity() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  saveSearchHistory(city);
  fetchWeatherByCity(city);
  toggleSearch();
  cityInput.value = "";
  searchHistoryDiv.style.display = "none";
}

// ===== INIT =====
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        showError("Couldn't get your location's weather.");
      }
    );
  } else {
    showError("Geolocation is not supported by this browser.");
  }
};

// ===== UNIT BUTTONS =====
document.getElementById("setCelsius").addEventListener("click", () => setUnits("metric"));
document.getElementById("setFahrenheit").addEventListener("click", () => setUnits("imperial"));
document.getElementById("setKelvin").addEventListener("click", () => setUnits("kelvin"));
