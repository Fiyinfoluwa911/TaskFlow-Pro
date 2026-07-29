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
