// ===== THEME =====
function setTheme(theme) {
  let settings = getSettings();
  settings.theme = theme;
  saveSettings(settings);

  if (theme === "dark") {
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#fff";
    document.querySelectorAll("nav, .modal-content, .weather-container").forEach(el => {
      el.style.backgroundColor = "#2a2a2a";
      el.style.color = "#fff";
    });
  } else {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#000";
    document.querySelectorAll("nav, .modal-content, .weather-container").forEach(el => {
      el.style.backgroundColor = "#f9f9f9";
      el.style.color = "#000";
    });
  }
}

// ===== LANGUAGE (Translate) =====
const translations = {
  en: {
    settings: "Settings",
    bgColor: "Background Color",
    defaultUnits: "Default Units",
    theme: "Theme",
    language: "Language",
    close: "Close",
    weather: "Weather",
    humidity: "Humidity",
    wind: "Wind Speed",
    searchPlaceholder: "Enter city..."
  },
  tr: {
    settings: "Ayarlar",
    bgColor: "Arka Plan Rengi",
    defaultUnits: "Varsayılan Birim",
    theme: "Tema",
    language: "Dil",
    close: "Kapat",
    weather: "Hava",
    humidity: "Nem",
    wind: "Rüzgar Hızı",
    searchPlaceholder: "Şehir gir..."
  }
};

function setLanguage(lang) {
  let settings = getSettings();
  settings.language = lang;
  saveSettings(settings);

  applyTranslations(lang);
}