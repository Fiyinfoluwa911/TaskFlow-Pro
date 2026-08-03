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


// ==========================================
// TASK STORAGE
// ==========================================

let tasks = [];
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


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

//When the page opens, load the saved 
// tasks automatically.
function createTaskCard(task) {

    const taskCard = document.createElement("div");

    taskCard.className = `task-card ${task.priority.toLowerCase()}`;

    taskCard.innerHTML = `
        <div class="task-info">
            <h3>${task.title}</h3>
            <p>Due ${formatDueDate(task.date)}</p>
        </div>

        <div class="task-actions">
            <span class="badge ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <button class="delete-btn">
                🗑
            </button>
        </div>
    `;

    const deleteButton = taskCard.querySelector(".delete-btn");

    deleteButton.addEventListener("click", () => {

        taskCard.remove();

        tasks = tasks.filter(t =>
            !(t.title === task.title &&
              t.date === task.date &&
              t.priority === task.priority)
        );

        saveTasks();

    });

    taskList.prepend(taskCard);

}

function loadTasks() {

    const storedTasks = localStorage.getItem("tasks");

    if (!storedTasks) return;

    tasks = JSON.parse(storedTasks);

    taskList.innerHTML = "";

    tasks.forEach(task => {

        createTaskCard(task);

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

    const task = {

        title,
        date,
        priority

    };

    tasks.push(task);

    saveTasks();

    

    console.log(localStorage.getItem("tasks"));



    createTaskCard(task);




    taskForm.reset();
    modal.classList.add("hidden");

    

    
});
loadTasks();    
