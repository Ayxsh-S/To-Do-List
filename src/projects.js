import {attachTaskEventListeners} from "./index.js";
import {setTab} from "./index.js";
import {highlight} from "./index.js";

export default function loadProjects() {
    const container = document.createElement("div");
    container.classList.add("projectPage");

    const heading = document.createElement("h1");
    heading.textContent = "";
    container.appendChild(heading)

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const projectsMap = tasks.reduce((acc, task) => {
        if (!acc[task.project]) acc[task.project] = [];
        acc[task.project].push(task);
        return acc;
    
    }, {});

    const sortedProjects = Object.keys(projectsMap).sort();
    sortedProjects.forEach(project => {
        const projectSection = document.createElement("section");
        projectSection.classList.add("projectSection");
        projectSection.addEventListener("click", () => {
            setTab("project", project);
            highlight("project", project);
        });
        
        const projectTitle = document.createElement("h2");
        projectTitle.textContent = project;
        projectSection.appendChild(projectTitle);

        const projectTasksList = document.createElement("div");
        projectTasksList.classList.add("projectTasksList");
        

        projectsMap[project].forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.dataset.id = task.id;

            taskDiv.innerHTML = `
                <div class="taskBody">
                    <div class="taskHeader"><h3>${task.title}</h3></div>
                    <p class="taskDesc">${task.desc}</p>
                </div>
                <div class="taskActions">
                    <button class="detailsBtn">ℹ️</button>
                    <button class="editBtn">✎</button>
                    <button class="deleteBtn">✖</button>
                </div>
            `;

            attachTaskEventListeners(taskDiv, task);

            projectTasksList.appendChild(taskDiv);
        });

        projectSection.appendChild(projectTasksList);
        container.appendChild(projectSection);
    });

    return container;

}