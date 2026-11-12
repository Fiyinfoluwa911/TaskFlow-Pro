// Get the saved theme
function loadTheme() {

    const savedTheme = localStorage.getItem("theme") || "light";

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

// Apply theme when the page loads
loadTheme();

// Listen for theme changes from other tabs
window.addEventListener("storage", function(event) {

    if (event.key === "theme") {
        loadTheme();
    }

});