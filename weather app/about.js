// ===== ABOUT PANEL =====
document.addEventListener("DOMContentLoaded", () => {
  const aboutPanel = document.getElementById("aboutPanel");
  const aboutBtn = document.getElementById("aboutBtn");
  const closeAbout = document.getElementById("closeAbout");

  if (aboutBtn && aboutPanel && closeAbout) {
    aboutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      aboutPanel.classList.add("open");
    });

    closeAbout.addEventListener("click", () => {
      aboutPanel.classList.remove("open");
    });
  }
});
