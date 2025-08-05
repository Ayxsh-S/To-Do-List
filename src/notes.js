export default function loadNotes() {
    const container = document.createElement("div");
    container.classList.add("notesPage");
    const addBtn = document.createElement("button");
    addBtn.id = "addNoteBtn";
    addBtn.textContent = "＋";
    addBtn.addEventListener("click", () => {
        const newNote = {
            id: Date.now().toString(),
            title: "Title goes here...",
            content: "Desc goes here..."
        };
        const notes = getNotes();
        notes.push(newNote);
        saveNotes(notes);
        renderNotes(notesContainer);
    });

    const notesContainer = document.createElement("div");
    notesContainer.id = "notesContainer";
    container.appendChild(addBtn);
    container.appendChild(notesContainer);
    renderNotes(notesContainer);

    return container;
}


function getNotes() {
    return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}


function renderNotes(container) {
    container.innerHTML = "";
    const notes = getNotes();

    notes.forEach(note => {
        const card = document.createElement("div");
        card.classList.add("noteCard");

        const title = document.createElement("div");
        title.classList.add("noteTitle");
        title.contentEditable = true;
        title.textContent = note.title;
        title.placeholder = "Title";
        title.addEventListener("input", () => {
            note.title = title.textContent;
            saveNotes(getNotes().map(n => n.id === note.id ? note : n));
        });

        const content = document.createElement("div");
        content.classList.add("noteContent");
        content.contentEditable = true;
        content.textContent = note.content;
        content.placeholder = "Task Desc...";
        content.addEventListener("input", () => {
            note.content = content.textContent;
            saveNotes(getNotes().map(n => n.id === note.id ? note : n));
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteNoteBtn");
        deleteBtn.textContent = "✖";
        deleteBtn.addEventListener("click", () => {
            const newNotes = getNotes().filter(n => n.id !== note.id);
            saveNotes(newNotes);
            renderNotes(container);
        });

        card.append(deleteBtn, title, content);
        container.appendChild(card);
    });
}
