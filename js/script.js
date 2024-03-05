let htmlParent;
let draggedItem = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector("#task_form");
    const input = document.querySelector("#task_input");
    htmlParent = document.querySelector("#tasks");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = input.value;
        if (!taskText) {
            return;
        }

        const date = new Date();
        const taskDate = date.toLocaleString();

        createTaskElement(taskText, taskDate, false);

        input.value = "";
    });

});

function buttonSortClick(compareType) {
    const tasksRaw = document.querySelectorAll("input.text");
    const rawDates = document.querySelectorAll("span.spanTime");
    const isTaskCompleted = document.querySelectorAll(".isTaskCompletedFlag");

    const tasks = Array.from(tasksRaw).map((task, i) => ({
        comparator: compareType === "abc" ? task.value : rawDates[i].textContent,
        title: task.value,
        date: rawDates[i].textContent,
        isCompleted: isTaskCompleted[i].classList.contains("taskCompleted")
    }));

    tasks.sort((a, b) => a.comparator.localeCompare(b.comparator));
    htmlParent.innerHTML = "";

    tasks.forEach(task => createTaskElement(task.title, task.date, task.isCompleted));
}

function createTaskElement(taskTitle, dateString, isCompleted) {
    const taskDivMain = document.createElement("div");
    taskDivMain.classList.add("task_main");
    htmlParent.appendChild(taskDivMain);

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.setAttribute("draggable", "true");
    taskDivMain.appendChild(taskDiv);

    const taskContentDiv = document.createElement("div");
    taskContentDiv.classList.add("content");
    taskDiv.appendChild(taskContentDiv);

    const taskInput = document.createElement("input");
    taskInput.classList.add("text");
    taskInput.type = "text";
    taskInput.value = taskTitle;
    taskInput.setAttribute("readonly", "readonly");
    taskContentDiv.appendChild(taskInput);

    const spanTime = document.createElement("span");
    spanTime.className = "spanTime";
    spanTime.textContent = dateString;
    taskContentDiv.appendChild(spanTime);

    const isTaskCompleted = document.createElement("div");
    isTaskCompleted.classList.add("isTaskCompletedFlag");
    if (isCompleted) {
        isTaskCompleted.classList.add("taskCompleted");
        taskInput.style.textDecoration = "line-through";
    }
    taskContentDiv.appendChild(isTaskCompleted);

    const taskActionsDiv = document.createElement("div");
    taskActionsDiv.classList.add("actions");
    taskDiv.appendChild(taskActionsDiv);

    const buttons = [
        { className: "Edit", text: "Edit" },
        { className: "Delete", text: "Delete" },
        { className: "Completed", text: "Completed" }
    ];

    buttons.forEach(({ className, text }) => {
        const button = document.createElement("button");
        button.classList.add(className);
        button.innerHTML = text;
        taskActionsDiv.appendChild(button);

        button.addEventListener('click', () => {
            if (className === "Edit") {
                if (button.innerText.toLowerCase() === "edit") {
                    taskInput.removeAttribute("readonly");
                    taskInput.focus();
                    button.innerText = "Save";
                    taskInput.style.textDecoration = "none";
                    isTaskCompleted.classList.remove("taskCompleted");
                } else {
                    taskInput.setAttribute("readonly", "readonly");
                    button.innerText = "Edit";
                }
            } else if (className === "Delete") {
                if (confirm("Are you sure you want to delete this task?")) {
                    htmlParent.removeChild(taskDivMain);
                }
            } else if (className === "Completed") {
                taskInput.style.textDecoration = "line-through";
                isTaskCompleted.classList.add("taskCompleted");
                taskInput.setAttribute("readonly", "readonly");
            }
        });
    });

    taskDiv.addEventListener('dragstart', (event) => {
        draggedItem = event.target;
        draggedItem.classList.add('dragitem__active');
    });
    taskDiv.addEventListener('dragend', () => {
        draggedItem.classList.remove('dragitem__active');
    });

    taskDivMain.addEventListener('dragover', (event) => {
        event.preventDefault();
    });
    taskDivMain.addEventListener('drop', (event) => {
        event.preventDefault();

        let draggedParentNode = draggedItem.parentNode;
        let dropParentNode = taskDivMain;

        draggedParentNode.appendChild(dropParentNode.firstChild);
        dropParentNode.appendChild(draggedItem);
    });
}
