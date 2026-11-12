// Get the Dark Mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");

// Get the Reset Settings button
const resetSettings = document.getElementById("resetSettings");

// Check the saved theme
let savedTheme = localStorage.getItem("theme") || "light";

// Apply the selected theme
function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    } else {
        document.body.classList.remove("dark-mode");
        darkModeToggle.checked = false;
    }

    localStorage.setItem("theme", theme);
}

// Apply saved theme when page opens
applyTheme(savedTheme);

// Listen for toggle changes
darkModeToggle.addEventListener("change", function() {

    if (darkModeToggle.checked) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

});

// Reset Settings
resetSettings.addEventListener("click", function() {

    const confirmReset = confirm(
        "Are you sure you want to restore the default settings?"
    );

    if (confirmReset) {
        applyTheme("light");
    }

});