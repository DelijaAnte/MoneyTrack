// darkmode.js
export function setupDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const darkModeStylesheet = document.getElementById("dark-mode-stylesheet");
  if (!darkModeStylesheet) return;

  if (localStorage.getItem("darkMode") === "enabled") {
    darkModeStylesheet.disabled = false;
    darkModeToggle.textContent = "🌙";
  } else {
    darkModeStylesheet.disabled = true;
    darkModeToggle.textContent = "☀️";
  }
  darkModeToggle.addEventListener("click", () => {
    if (darkModeStylesheet.disabled) {
      darkModeStylesheet.disabled = false;
      localStorage.setItem("darkMode", "enabled");
      darkModeToggle.textContent = "🌙";
    } else {
      darkModeStylesheet.disabled = true;
      localStorage.setItem("darkMode", "disabled");
      darkModeToggle.textContent = "☀️";
    }
  });
}
