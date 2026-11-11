//Reads the tasks you have already saved on your dashboard.
//Counts all tasks.
//Counts completed and pending tasks.
//Identifies overdue tasks.
//Calculates your completion percentage.
//Updates the progress bar.
// Get saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Get dashboard elements
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const overdueTasks = document.getElementById("overdueTasks");

const progressFill = document.getElementById("progressFill");
const completionPercentage = document.getElementById("completionPercentage");

// Calculate task statistics
function updateAnalytics() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter(task => {
        if (task.completed || !task.date) return false;

        const dueDate = new Date(task.date + "T00:00:00");

        return dueDate < today;
    }).length;

    // Update statistics
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    overdueTasks.textContent = overdue;

    // Calculate completion percentage
    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressFill.style.width = percentage + "%";

    completionPercentage.textContent =
        percentage + "% Completed";
}

// Run analytics
updateAnalytics();


// Create Productivity Chart
const chartCanvas = document.getElementById("productivityChart");

const completedCount = tasks.filter(task => task.completed).length;

const pendingCount = tasks.filter(task => !task.completed).length;

const productivityChart = new Chart(chartCanvas, {
    type: "doughnut",

    data: {
        labels: ["Completed Tasks", "Pending Tasks"],

        datasets: [{
            label: "Task Progress",

            data: [completedCount, pendingCount],

            backgroundColor: [
                "#4f46e5",
                "#e5e7eb"
            ],

            borderWidth: 0
        }]
    },

    options: {
        responsive: true,

        maintainAspectRatio: true,

        plugins: {
            legend: {
                position: "bottom"
            },

            title: {
                display: true,
                text: "Completed vs Pending Tasks"
            }
        }
    }
});


//Detects when tasks change in another browser tab.
//Refreshes your total tasks.
//Updates completed and pending tasks.
//Recalculates overdue tasks and completion percentage.
//Updates your doughnut chart.
// Automatically refresh when tasks change in another tab
window.addEventListener("storage", function(event) {

    if (event.key === "tasks") {

        tasks = JSON.parse(event.newValue) || [];

        // Refresh statistics
        updateAnalytics();

        // Refresh chart data
        const completed = tasks.filter(task => task.completed).length;

        const pending = tasks.filter(task => !task.completed).length;

        productivityChart.data.datasets[0].data = [
            completed,
            pending
        ];

        productivityChart.update();
    }

});
