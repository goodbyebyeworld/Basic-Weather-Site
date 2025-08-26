// Locations panelini aç/kapat
function toggleSearch() {
  const searchBox = document.getElementById("searchBox");
  searchBox.classList.toggle("open");
}

// Locations panelini kapat (çarpı tuşu için)
function closeSearch() {
  document.getElementById("searchBox").classList.remove("open");
}

