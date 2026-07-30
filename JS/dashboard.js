// ==========================================
// TASK MODAL
// ==========================================

console.log("Dashboard JS Loaded");

const addTaskButton = document.querySelector(".add-task");
const modal = document.getElementById("taskModal");
const closeButton = document.getElementById("closeModal");

console.log(addTaskButton);
console.log(modal);
console.log(closeButton);

if (addTaskButton && modal && closeButton) {

    addTaskButton.addEventListener("click", () => {
        console.log("Add Task button clicked");
        modal.classList.toggle("hidden");
    });

    closeButton.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.toggle("hidden");
        }
    });

} else {
    console.error("One or more elements were not found.");
}

// ==========================================
// TASK FORM
// ==========================================

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");

function formatDueDate(dateString) {

    const today = new Date();
    const dueDate = new Date(dateString);

    // Remove time from both dates
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    if (diffDays > 1 && diffDays <= 6) {
        return dueDate.toLocaleDateString("en-US", {
            weekday: "long"
        });
    }

    return dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

}


taskForm.addEventListener("submit", (event) => {    
    // stop the page from refreshing
    event.preventDefault();

    const title = taskTitle.value.trim();
    const date = taskDate.value;
    const priority = taskPriority.value;

    if (title === "") {
        alert("Please enter a task title.");
        return;
    }

    const taskCard = document.createElement("div");
    taskCard.className = `task-card ${priority.toLowerCase()}`;

    taskCard.innerHTML = `
        <div class="task-info">
            <h3>${title}</h3>
            <p>Due: ${formatDueDate(date)}</p>
        </div>
        <span class="badge ${priority.toLowerCase()}">${priority}</span>
    `;

    taskList.prepend(taskCard);

    taskForm.reset();
    modal.classList.add("hidden");

});