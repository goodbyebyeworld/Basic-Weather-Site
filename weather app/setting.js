// SETTINGS PANEL
function openSettings() {
  document.getElementById("settingsPanel").classList.add("open");
}

function closeSettings() {
  document.getElementById("settingsPanel").classList.remove("open");
}

// ===== THEME =====
function setTheme(theme) {
  let settings = getSettings();
  settings.theme = theme;
  saveSettings(settings);

  if (theme === "dark") {
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#fff";
    document.querySelectorAll("nav, .modal-content").forEach(el => {
      el.style.backgroundColor = "#2a2a2a";
      el.style.color = "#fff";
    });

    // Weather container dark mode
    const weatherBox = document.querySelector(".weather-container");
    if (weatherBox) {
      weatherBox.style.backgroundColor = "#121212"; 
      weatherBox.style.color = "#fff";
    }

  } else {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#000";
    document.querySelectorAll("nav, .modal-content").forEach(el => {
      el.style.backgroundColor = "#f9f9f9";
      el.style.color = "#000";
    });

    // Weather container light mode
    const weatherBox = document.querySelector(".weather-container");
    if (weatherBox) {
      weatherBox.style.backgroundColor = "#cce7ff"; 
      weatherBox.style.color = "#000";
    }
  }
}

// ===== DİL DEĞİŞTİRİCİ =====
function changeLanguage(lang) {
  const title = document.querySelector("h1");
  const settingsTitle = document.querySelector("#settingsPanel h2");

  const translations = {
    en: { title: "Weather Time", settings: "Settings" },
    tr: { title: "Hava Zamanı", settings: "Ayarlar" },
    kk: { title: "Ауа райы уақыты", settings: "Баптаулар" },
    el: { title: "Καιρός Χρόνος", settings: "Ρυθμίσεις" },
    de: { title: "Wetter Zeit", settings: "Einstellungen" },
    fr: { title: "Temps Météo", settings: "Paramètres" },
    es: { title: "Tiempo del Clima", settings: "Configuraciones" },
    it: { title: "Tempo Meteo", settings: "Impostazioni" },
    ru: { title: "Погода Время", settings: "Настройки" },
    ar: { title: "وقت الطقس", settings: "الإعدادات" },
    zh: { title: "天气时间", settings: "设置" },
    ja: { title: "天気タイム", settings: "設定" },
    ko: { title: "날씨 시간", settings: "설정" },
    hi: { title: "मौसम समय", settings: "सेटिंग्स" },
    fa: { title: "زمان هوا", settings: "تنظیمات" },
    pt: { title: "Tempo do Clima", settings: "Configurações" },
    nl: { title: "Weer Tijd", settings: "Instellingen" },
    pl: { title: "Czas Pogody", settings: "Ustawienia" },
    sv: { title: "Väder Tid", settings: "Inställningar" },
    cs: { title: "Čas Počasí", settings: "Nastavení" },
    uk: { title: "Час Погоди", settings: "Налаштування" },
    ro: { title: "Ora Meteo", settings: "Setări" },
    hu: { title: "Időjárás Idő", settings: "Beállítások" },
    th: { title: "เวลาสภาพอากาศ", settings: "การตั้งค่า" },
    id: { title: "Waktu Cuaca", settings: "Pengaturan" },
    ms: { title: "Masa Cuaca", settings: "Tetapan" },
    vi: { title: "Thời Gian Thời Tiết", settings: "Cài đặt" },
    sr: { title: "Време Време", settings: "Подешавања" },
    bg: { title: "Време Време", settings: "Настройки" },
    hr: { title: "Vrijeme Vrijeme", settings: "Postavke" },
    da: { title: "Vejr Tid", settings: "Indstillinger" },
    fi: { title: "Sää Aika", settings: "Asetukset" },
    he: { title: "זמן מזג אוויר", settings: "הגדרות" }
  };

  const t = translations[lang] || translations["en"];
  title.innerText = t.title;
  settingsTitle.innerText = t.settings;

  localStorage.setItem("lang", lang);
}


// Yüklenince ayarları uygula
window.addEventListener("load", () => {
  const theme = localStorage.getItem("theme");
  if (theme) setTheme(theme);

  const lang = localStorage.getItem("lang");
  if (lang) changeLanguage(lang);
});
