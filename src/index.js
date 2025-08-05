import "./style.css";
import loadHome from "./home.js";
import loadProjects from "./projects.js";
import loadNotes from "./notes.js";

const content = document.getElementById("content")
const tabs = document.querySelectorAll(".tabs button[data-tab]");
let activeTabButton = null;
let currentTab = "home";
let currentProject = null;

function clearPage() {
    content.innerHTML = "";
}

export function setTab(tab, project = null) {
    clearPage();
    let page;
    switch (tab) {
        case "home":
            page = loadHome();
            break;
        case "projects":
            page = loadProjects();
            break;
        case "notes":
            page = loadNotes();
            break;
        case "project":
            page = loadProjects();
            if (page) content.appendChild(page);
            currentTab = "project";
            currentProject = project;
            loadProjectTasksPage(project);
            highlight("projects", project);
            return;
    }
    if (page) content.appendChild(page);
    highlight(tab, project);

}

export function highlight(tab, projectName = null) {
    tabs.forEach(button => {
        const tabName = button.getAttribute("data-tab");
        if (tab === "project") {
            if (tabName === "projects") {
            button.classList.add("active");
            activeTabButton = button;
            } else {
                button.classList.remove("active");
            }
            document.querySelectorAll(".sidebar-project").forEach(btn => {
                if (btn.getAttribute("data-project") === projectName) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        } else if (button.getAttribute("data-tab") === tab) {
            button.classList.add("active");
            activeTabButton = button;
            document.querySelectorAll(".sidebar-project").forEach(b => b.classList.remove("active"));
        } else {
            button.classList.remove("active");
        }
    });
}

tabs.forEach(button => {
    button.addEventListener("click", () => {
        const tab = button.getAttribute("data-tab");
        if (button === activeTabButton) return;
        setTab(tab);
        if (tab !== "project") {
            document.querySelectorAll(".sidebar-project").forEach(btn => btn.classList.remove("active"));
        }
    });
});

const modal = document.getElementById("taskModal");
const openModalBtn = document.getElementById("openModalBtn");
const span = document.getElementsByClassName("close")[0];
const form = document.getElementById("taskForm");
const detailsModal = document.getElementById("detailsModal");
const detailsContent = document.getElementById("detailsContent");
const detailsClose = document.getElementById("detailsClose");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editTitleInput = document.getElementById("editTitle");
const editDescInput = document.getElementById("editDesc");
const editClose = document.getElementById("editClose");
let taskBeingEdited = null;

openModalBtn.onclick = function() {
    modal.classList.remove("hidden");
}
span.onclick = function() {
    modal.classList.add("hidden");
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.add("hidden");
        document.body.classList.remove("modal-open");
        
    }
    if (event.target === detailsModal) {
        detailsModal.classList.add("hidden");
        document.body.classList.remove("modal-open");
    }
   
}

const editProjectInput = document.getElementById("editProject");
const editDateInput = document.getElementById("editDate");
const editPriorityInput = document.getElementById("editPriority");
editForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (taskBeingEdited) {
        const newTitle = editTitleInput.value.trim();
        const newDesc = editDescInput.value.trim();
        const newProject = editProjectInput.value.trim();
        const newDate = editDateInput.value.trim();
        const newPriority = editPriorityInput.value.trim()
        if (!newTitle || !newDesc || !newProject || !newDate || !newPriority) return;

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.map(task => {
            if (task.id === taskBeingEdited.dataset.id) {
                return { ...task, title: newTitle, desc: newDesc, project: newProject, dueDate: newDate, priority: newPriority };
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        editModal.classList.add("hidden");
        taskBeingEdited = null;
        if (currentTab === "home") {
            loadTasksAndDisplay();
        } else if (currentTab === "project" && currentProject) {
            setTab("project", currentProject);
        }

        updateProjectsSidebar();
    }
});


export function attachTaskEventListeners(taskDiv, task) {
    taskDiv.querySelector(".deleteBtn").addEventListener("click", () => {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(t => t.id !== task.id);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskDiv.remove();
        updateProjectsSidebar();
    });

    taskDiv.querySelector(".editBtn").addEventListener("click", () => {
        editTitleInput.value = task.title;
        editDescInput.value = task.desc;
        editProjectInput.value = task.project;
        editDateInput.value = task.date;
        editPriorityInput.value = task.priority;
        taskBeingEdited = taskDiv;
        editModal.classList.remove("hidden");
        document.body.classList.add("modal-open");
    });

    taskDiv.querySelector(".detailsBtn").addEventListener("click", () => {
        detailsContent.innerHTML = `<h3>Title: ${task.title}</h3><p>Description: ${task.desc}</p><p>Project: ${task.project}</p><p>Due Date: ${task.dueDate}</p><p>Priority: ${task.priority}`;
        detailsModal.classList.remove("hidden");
        document.body.classList.add("modal-open");
        
    });

}


export function loadTasksAndDisplay() {
    const homeTaskList = document.getElementById("homeTaskList");
    if (!homeTaskList) return; 
    homeTaskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.dataset.id = task.id;
        taskDiv.dataset.project = task.project.toLowerCase();
        const date = new Date(task.dueDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formatted = date.toLocaleDateString(undefined, options);
        const priority = task.priority?.toLowerCase();
        if (priority === "low") {
            taskDiv.classList.add("low-priority");
        } else if (priority === "medium") {
            taskDiv.classList.add("medium-priority");
        } else if (priority === "high") {
            taskDiv.classList.add("high-priority");
        }

        

        taskDiv.innerHTML = `
            <div class="taskBody">
                <div class="taskHeader"><h3>${task.title}</h3></div>
                <p class="taskDesc">${task.desc}</p>
                <p class="taskProject">Project: ${task.project}</p>
            </div>
            <div class="taskActions">
                <div class="date"><p>${formatted}</p></div>
                <button class="detailsBtn">ℹ️</button>
                <button class="editBtn">✎</button>
                <button class="deleteBtn">✖</button>
            </div>
        `;

        if (isOverdue(task.dueDate)) {
            taskDiv.classList.add("overdue");
        }

        attachTaskEventListeners(taskDiv, task);

        homeTaskList.appendChild(taskDiv);
    });
}

function updateProjectsSidebar() {
    const sidebar = document.querySelector(".tabs");
    sidebar.querySelectorAll(".sidebar-project").forEach(btn => btn.remove());

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let projects = [...new Set(tasks.map(task => task.project))];

    projects.forEach(project => {
        const btn = document.createElement("button");
        btn.textContent = project;
        btn.setAttribute("data-project", project);
        btn.classList.add("sidebar-project");
        sidebar.appendChild(btn);

        btn.addEventListener("click", () => {
            setTab("project", project);
            sidebar.querySelectorAll(".sidebar-project").forEach(b => b.classList.remove("active"));
            btn.classList.add("active")
        });
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const desc = document.getElementById("taskDesc").value.trim();
    const project = document.getElementById("taskProject").value.trim();
    const dueDate = document.getElementById("taskDate").value.trim();
    const priority = document.querySelector("#priorityDropdown .selected").dataset.value;

    if (!title || !desc || !project || !dueDate || !priority) return;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const id = Date.now().toString();
    tasks.push({ id, title, desc, project, dueDate, priority: priority});
    localStorage.setItem("tasks", JSON.stringify(tasks));

    modal.classList.add("hidden");
    loadTasksAndDisplay();
    updateProjectsSidebar();
    form.reset();
});



function loadProjectTasksPage(project) {
    clearPage();
    const container = document.createElement("div");
    container.classList.add("projectTasksPage");

    const backBtn = document.createElement("button");
    backBtn.classList.add("back-button")
    backBtn.textContent = "← Back to Projects";
    backBtn.addEventListener("click", () => {
        setTab("projects")
        document.querySelectorAll(".sidebar-project").forEach(b => b.classList.remove("active"));
});
    container.appendChild(backBtn);

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filteredTasks = tasks.filter(task => task.project === project);

    filteredTasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.dataset.id = task.id;
        taskDiv.dataset.project = task.project.toLowerCase();
        const date = new Date(task.dueDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = date.toLocaleDateString(undefined, options);

        taskDiv.innerHTML = `
            <div class="taskBody">
                <div class="taskHeader"><h3>${task.title}</h3></div>
                <p class="taskDesc">${task.desc}</p>
                <p class="taskProject">Project: ${task.project}</p>
            </div>
            <div class="taskActions">
               <p class="date">${formatted}</p>
                <button class="detailsBtn">ℹ️</button>
                <button class="editBtn">✎</button>
                <button class="deleteBtn">✖</button>
            </div>
        `;

        attachTaskEventListeners(taskDiv, task);

        container.appendChild(taskDiv);
    });
    

    content.appendChild(container);
}


window.addEventListener("DOMContentLoaded", () => {
    setTab("home");
    setTimeout(() => loadTasksAndDisplay(), 0);
    updateProjectsSidebar();
    setTab("home"); 
});


detailsClose.onclick = () => {
    detailsModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
};

editClose.onclick = () => {
    editModal.classList.add("hidden");
    document.body.classList.remove("modal-open");

};


const dropdown = document.getElementById("priorityDropdown");
const selected = dropdown.querySelector(".selected");
const options = dropdown.querySelector(".dropdown-options");
const optionItems = dropdown.querySelectorAll(".option");

dropdown.addEventListener("click", () => {
  options.classList.toggle("hidden");
});

optionItems.forEach(option => {
  option.addEventListener("click", (e) => {
    selected.textContent = option.textContent;
    selected.dataset.value = option.dataset.value;
    options.classList.add("hidden");
    e.stopPropagation();
  });
});

document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    options.classList.add("hidden");
  }
});

function isOverdue(dueDateInput) {
    const today = new Date();
    const dueDate = new Date(dueDateInput);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
} 