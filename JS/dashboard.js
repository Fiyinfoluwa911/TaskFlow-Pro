console.log("Dashboard JS Loaded");

// ==========================================
// MODAL
// ==========================================

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
        modal.classList.add("hidden");
    });

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            modal.classList.add("hidden");
        }

    });

} else {

    console.error("One or more modal elements were not found.");

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
// STATISTICS ELEMENTS
// ==========================================

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const productivity = document.getElementById("productivity");


// ==========================================
// TASK STORAGE
// ==========================================

let tasks = [];

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    productivity.textContent = percent + "%";

}


// ==========================================
// FORMAT DUE DATE
// ==========================================

function formatDueDate(dateString) {

    const today = new Date();
    const dueDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
        (dueDate - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
        return "Today";
    }

    if (diffDays === 1) {
        return "Tomorrow";
    }

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


// ==========================================
// CREATE TASK CARD
// ==========================================

function createTaskCard(task) {

    const taskCard = document.createElement("div");

    taskCard.className =
        `task-card ${task.priority.toLowerCase()}`;

    if (task.completed) {
        taskCard.classList.add("completed");
    }

    taskCard.innerHTML = `

        <div class="task-info">

            <h3>${task.title}</h3>

            <p>
                Due ${formatDueDate(task.date)}
            </p>

        </div>

        <div class="task-actions">

            <button
                class="complete-btn"
                title="Complete task">
                ${task.completed ? "✔" : "○"}
            </button>

            <button
                class="delete-btn"
                title="Delete task">
                🗑
            </button>

            <span class="badge ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

        </div>

    `;


    // ==========================================
    // COMPLETE BUTTON
    // ==========================================

    const completeButton =
        taskCard.querySelector(".complete-btn");

    completeButton.addEventListener("click", () => {

        task.completed = !task.completed;

        taskCard.classList.toggle(
            "completed",
            task.completed
        );

        completeButton.textContent =
            task.completed ? "✔" : "○";

        saveTasks();

        updateStatistics();

    });


    // ==========================================
    // DELETE BUTTON
    // ==========================================

    const deleteButton =
        taskCard.querySelector(".delete-btn");

    deleteButton.addEventListener("click", () => {

        taskCard.remove();

        tasks = tasks.filter(t => t !== task);

        saveTasks();

        updateStatistics();

    });


    taskList.prepend(taskCard);

}


// ==========================================
// LOAD SAVED TASKS
// ==========================================

function loadTasks() {

    const storedTasks =
        localStorage.getItem("tasks");

    if (storedTasks) {

        tasks = JSON.parse(storedTasks);

    }

    taskList.innerHTML = "";

    tasks.forEach(task => {

        createTaskCard(task);

    });

    updateStatistics();

}


// ==========================================
// ADD NEW TASK
// ==========================================

taskForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const title =
        taskTitle.value.trim();

    const date =
        taskDate.value;

    const priority =
        taskPriority.value;


    if (title === "") {

        alert("Please enter a task title.");

        return;

    }


    const task = {

        title: title,

        date: date,

        priority: priority,

        completed: false

    };


    tasks.push(task);

    saveTasks();

    createTaskCard(task);

    updateStatistics();

    console.log(
        "Saved tasks:",
        localStorage.getItem("tasks")
    );


    taskForm.reset();

    modal.classList.add("hidden");

});


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

loadTasks();