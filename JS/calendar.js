const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");

const selectedDateTitle =
    document.getElementById("selectedDateTitle");

const selectedDateTasks =
    document.getElementById("selectedDateTasks");


// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current date
const today = new Date();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let selectedDate = null;


// Display calendar
function renderCalendar() {

    calendarDays.innerHTML = "";

    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();

    const lastDate = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    monthYear.textContent = new Date(
        currentYear,
        currentMonth
    ).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });


    // Empty spaces before the first day
    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.className = "calendar-day empty";

        calendarDays.appendChild(emptyDay);

    }

    // Generate calendar dates
    for (let day = 1; day <= lastDate; day++) {

        const dateKey =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dayElement = document.createElement("div");

        dayElement.className = "calendar-day";

        const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

        if (isToday) {
            dayElement.classList.add("today");
        }

        if (selectedDate === dateKey) {
            dayElement.classList.add("selected");
        }

        dayElement.innerHTML = `
            <span class="day-number">${day}</span>
        `;

        // Find tasks due on this date
        const dayTasks = tasks.filter(task =>
            task.date === dateKey
        );

        dayTasks.forEach(task => {

            const taskDot = document.createElement("span");

            taskDot.className = 
            `task-dot ${task.priority.toLowerCase()}`;

            if (task.completed) {
                taskDot.classList.add("completed");
            }

            taskDot.textContent = task.title;

            dayElement.appendChild(taskDot);

        });

        

        dayElement.addEventListener("click", () => {

            selectedDate = dateKey;

            renderCalendar();

            showDateTasks(dateKey);

        });

        calendarDays.appendChild(dayElement);

    }

}

// Show tasks for selected date

function showDateTasks(dateKey) {

    const dateTasks = tasks.filter(task =>
        task.date === dateKey
    );

    selectedDateTitle.textContent =
        new Date(dateKey + "T00:00:00").toDateString();

    selectedDateTasks.innerHTML = "";

    if (dateTasks.length === 0) {

        selectedDateTasks.innerHTML =
            "<p>No tasks scheduled for this date.</p>";

        return;

    }

    dateTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "selected-task";

        if (task.completed) {
            taskElement.classList.add("completed-task");
        }

        taskElement.innerHTML = `
            <div class="selected-task-info">

                <h3></h3>

                <span class="priority-badge"></span>

                <span class="completion-status"></span>

                <div class="calendar-task-actions">
                    <button class="calendar-complete-btn"></button>
                    <button class="calendar-edit-btn">Edit</button>
                    <button class="calendar-delete-btn">Delete</button>
                </div>

            </div>
        `;

        // Display task title
        taskElement.querySelector("h3").textContent =
            task.title;

        // Display priority
        const priorityBadge =
            taskElement.querySelector(".priority-badge");

        priorityBadge.textContent = task.priority;

        priorityBadge.classList.add(
            task.priority.toLowerCase()
        );

        // Display completion status
        const completionStatus =
            taskElement.querySelector(".completion-status");

        completionStatus.textContent = task.completed
            ? "Completed"
            : "Pending";

        // Complete and Undo button
        const completeButton =
            taskElement.querySelector(".calendar-complete-btn");

        completeButton.textContent = task.completed
            ? "Undo"
            : "Complete Task";

        completeButton.addEventListener("click", () => {

            task.completed = !task.completed;

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            renderCalendar();
            showDateTasks(dateKey);

        });

        // Edit button
        const editButton =
            taskElement.querySelector(".calendar-edit-btn");

        editButton.addEventListener("click", () => {

            const newTitle = prompt(
                "Edit task title:",
                task.title
            );

            if (newTitle === null || newTitle.trim() === "") {
                return;
            }

            const newPriority = prompt(
                "Enter priority: High, Medium or Low",
                task.priority
            );

            if (newPriority === null) {
                return;
            }

            const priority = newPriority.trim().toLowerCase();

            if (!["high", "medium", "low"].includes(priority)) {
                alert("Please enter High, Medium or Low.");
                return;
            }

            const newDate = prompt(
                "Enter due date (YYYY-MM-DD):",
                task.date
            );

            if (newDate === null) {
                return;
            }

            const validDate = new Date(newDate + "T00:00:00");

            if (
                !/^\d{4}-\d{2}-\d{2}$/.test(newDate) ||
                Number.isNaN(validDate.getTime()) ||
                validDate.toISOString().slice(0, 10) !== newDate
            ) {
                alert("Please enter a valid date in YYYY-MM-DD format.");
                return;
            }

            task.title = newTitle.trim();

            task.priority =
                priority.charAt(0).toUpperCase() + priority.slice(1);

            task.date = newDate;

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            renderCalendar();
            showDateTasks(dateKey);

        });

        // Delete button
        const deleteButton =
            taskElement.querySelector(".calendar-delete-btn");

        deleteButton.addEventListener("click", () => {

            const confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );

            if (!confirmDelete) {
                return;
            }

            tasks = tasks.filter(t => t !== task);

            localStorage.setItem(
                "tasks",
                JSON.stringify(tasks)
            );

            renderCalendar();
            showDateTasks(dateKey);

        });

        selectedDateTasks.appendChild(taskElement);

    });

}




// Previous month
prevMonth.addEventListener("click", () => {

    currentMonth--;

    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;

    }

    renderCalendar();

});

// Next month
nextMonth.addEventListener("click", () => {

    currentMonth++;

    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;

    }

    renderCalendar();

});

// Today button
todayBtn.addEventListener("click", () => {

    currentMonth = today.getMonth();
    currentYear = today.getFullYear();

    selectedDate = null;

    selectedDateTitle.textContent = "Select a date";

    selectedDateTasks.innerHTML =
        "<p>Select a date to view your tasks.</p>";

    renderCalendar();

});

// Start calendar
renderCalendar();