import {loadTasksAndDisplay} from "./index.js";
import {attachTaskEventListeners} from "./index.js";

export default function loadHome() {
    const container = document.createElement("div");
    container.classList.add("home");

    const heading = document.createElement("h1");
    heading.textContent = "";
    container.appendChild(heading)

    
    const taskList = document.createElement("div");
    taskList.id = "homeTaskList";
    container.appendChild(taskList);

    setTimeout(() => loadTasksAndDisplay(), 0);
    return container;

}