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

// Arama geçmişi div (HTML'de #searchBox içinde eklenmeli)
let searchHistoryDiv = document.getElementById("searchHistory");
if (!searchHistoryDiv) {
  searchHistoryDiv = document.createElement("div");
  searchHistoryDiv.id = "searchHistory";
  searchHistoryDiv.style.display = "none";
  searchHistoryDiv.style.position = "relative"; // pozisyon styling için
  searchBox.appendChild(searchHistoryDiv);
}

searchBox.style.display = "none";
errorBox.style.display = "none";
loading.style.display = "none";
weatherBox.style.display = "none";

// ====== SETTINGS (Kullanıcı Ayarları) ======

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
  showWeather(settings);
}

function getUnits() {
  let settings = getSettings();
  return settings.units || "metric"; // Default: metric (°C)
}

// Toggle search box visibility
function toggleSearch() {
  const isVisible = searchBox.style.display === "block";
  searchBox.style.display = isVisible ? "none" : "block";
  cityInput.focus();
  showSearchHistory();
}

// Show error message
function showError(message) {
  errorBox.innerText = message;
  errorBox.style.display = "block";
  setTimeout(() => {
    errorBox.style.display = "none";
  }, 4000);
}

// Show loading state
function showLoading(isLoading) {
  loading.style.display = isLoading ? "block" : "none";
  if (isLoading) {
    weatherBox.style.display = "none";
    errorBox.style.display = "none";
  }
}

// Display weather information
function showWeather(data) {
  weatherCity.innerText = `${data.name}, ${data.sys.country}`;
  weatherIcon.src = data.weather[0].icon.startsWith("http")
    ? data.weather[0].icon
    : `https:${data.weather[0].icon}`;
  weatherIcon.alt = data.weather[0].description;
  weatherTemp.innerText = `Temperature: ${data.main.temp} °C`;
  weatherDesc.innerText = `Weather: ${capitalizeFirstLetter(data.weather[0].description)}`;
  weatherHumidity.innerText = `Humidity: ${data.main.humidity}%`;
  weatherWind.innerText = `Wind Speed: ${data.wind.speed.toFixed(1)} m/s`;

  weatherBox.style.display = "block";
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fetch weather data by city name
function fetchWeatherByCity(city) {
  showLoading(true);
  const units = getUnits();
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&units=${units}&aqi=no`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("City not found.");
      return res.json();
    })
    .then((data) => {
      const formattedData = {
        name: data.location.name,
        sys: { country: data.location.country },
        main: { temp: data.current.temp_c, humidity: data.current.humidity },
        weather: [{ description: data.current.condition.text, icon: data.current.condition.icon }],
        wind: { speed: data.current.wind_kph / 3.6 },
      };
      showWeather(formattedData);
    })
    .catch((err) => {
      showError(err.message);
    })
    .finally(() => {
      showLoading(false);
    });
}

// Fetch weather data by geolocation
function fetchWeatherByCoords(lat, lon) {
  showLoading(true);
  const units = getUnits();
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&units=${units}&aqi=no`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch weather for your location.");
      return res.json();
    })
    .then((data) => {
      const formattedData = {
        name: data.location.name,
        sys: { country: data.location.country },
        main: { temp: data.current.temp_c, humidity: data.current.humidity },
        weather: [{ description: data.current.condition.text, icon: data.current.condition.icon }],
        wind: { speed: data.current.wind_kph / 3.6 },
      };
      showWeather(formattedData);
    })
    .catch((err) => {
      showError(err.message);
    })
    .finally(() => {
      showLoading(false);
    });
}

// ====== Arama Geçmişi Fonksiyonları ======

// Get search history from localStorage
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

// Save city to search history in localStorage
function saveSearchHistory(city) {
  let history = getSearchHistory();
  city = city.trim();
  if (!city) return;

  // Aynı şehri tekrar ekleme
  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());

  // Add the city to the beginning
  history.unshift(city);

  // Limit to the last 5 searches
  if (history.length > 5) history.pop();

  localStorage.setItem("searchHistory", JSON.stringify(history));
}

// Show search history suggestions based on input
function showSearchHistory() {
  let history = getSearchHistory();
  if (history.length === 0) {
    searchHistoryDiv.style.display = "none";
    return;
  }

  const filterVal = cityInput.value.toLowerCase();

  // Filter history based on user input
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

// Event listeners for search input focus and input changes
cityInput.addEventListener("focus", showSearchHistory);
cityInput.addEventListener("input", showSearchHistory);

// Search city and display weather
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

// Get weather based on user's geolocation on page load
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

// Button actions for changing units
document.getElementById("setCelsius").addEventListener("click", () => setUnits("metric"));
document.getElementById("setFahrenheit").addEventListener("click", () => setUnits("imperial"));
document.getElementById("setKelvin").addEventListener("click", () => setUnits("standard"));
