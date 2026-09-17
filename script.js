let tasks = [];

let taskInput = document.getElementById("taskInput");
let addButton = document.getElementById("addButton");
let taskList = document.getElementById("taskList");

// Load saved tasks from localStorage on page load
const savedTasks = localStorage.getItem("tasks");

if (savedTasks !== null) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach(function(task) {
        // Backwards compatible whether task is an object or old plain string
        let text = typeof task === "object" ? task.text : task;
        createTaskElement(text);
    });
}

console.log(tasks);

// Helper function to create and display a task item
function createTaskElement(tasktext) {
    let li = document.createElement("li");
    li.classList.add("task");

    let leftSection = document.createElement("div");
    leftSection.classList.add("task-left");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    let span = document.createElement("span");
    span.textContent = tasktext;

    let editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    let actions = document.createElement("div");
    actions.classList.add("task-actions");
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    leftSection.appendChild(checkbox);
    leftSection.appendChild(span);

    li.appendChild(leftSection);
    li.appendChild(actions);

    taskList.appendChild(li);

    checkbox.addEventListener("change", function() {
        li.classList.toggle("completed");
    });

    editButton.addEventListener("click", function() {
        let currentText = span.textContent;
        let newText = prompt("Edit your task:", currentText);
        if (newText !== null && newText.trim() !== "") {
            let taskItem = tasks.find(t => (typeof t === "object" ? t.text : t) === currentText);
            if (taskItem) {
                if (typeof taskItem === "object") {
                    taskItem.text = newText.trim();
                } else {
                    let idx = tasks.indexOf(currentText);
                    tasks[idx] = newText.trim();
                }
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
            span.textContent = newText.trim();
        }
    });

    deleteButton.addEventListener("click", function() {
        li.remove();
        tasks = tasks.filter(t => (typeof t === "object" ? t.text : t) !== span.textContent);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });
}

function addTask() {
    let tasktext = taskInput.value.trim();

    if (tasktext === "") {
        alert("Please Enter a task");
        return;
    }

    // Save timestamp in localStorage object only
    let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let taskObj = {
        text: tasktext,
        addedAt: currentTime,
        submittedAt: new Date().toISOString()
    };

    createTaskElement(taskObj.text);

    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});