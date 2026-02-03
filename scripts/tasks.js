import { Storage } from "./storage.js";
import { AudioEngine } from "./audio.js";

export const Tasks = {
    // These are dynamic components -> so not in ui.js (idem for listeners)
    list: document.getElementById("task-list"),
    template: document.getElementById("task-template"),

    // Load tasks from storage on startup
    savedTasks: JSON.parse(localStorage.getItem("tasks")) || [],

    init() {
        this.savedTasks.forEach(task => this.render(task));
    },
    
    // Add tasks
    add(text) {
        const newTask = {
            id: Date.now(), // Unique ID
            text: text,
            completed: false,
        };

        this.savedTasks.push(newTask);
        this.save();
        this.render(newTask);
        AudioEngine.play("boop");
    },

    render(taskData) {
        // 1. Clone template
        const clone = this.template.content.cloneNode(true);

        // 2. Find elements inside the clone
        const li = clone.querySelector(".task-item");
        const textSpan = clone.querySelector(".task-text");
        const checkbox = clone.querySelector(".task-checkbox");
        const deleteBtn = clone.querySelector(".task-delete-btn");

        // 3. Fill data
        li.dataset.id = taskData.id; // Store id in html for easy finding
        textSpan.textContent = taskData.text;
        checkbox.checked = taskData.completed;

        if (taskData.completed) li.classlist.add("completed");

        // 4. Add listeners (checkbox)
        checkbox.addEventListener("change", () => {
            this.toggle(taskData.id, li, checkbox.checked);
        });

        // 5. Add listeners (delete)
        deleteBtn.addEventListener("click", () => {
            this.remove(taskData.id, li);
        });

        // 6. Append to list
        this.list.appendChild(clone);
    },
    
    toggle(id, element, isChecked) {
        // Update visual
        if (isChecked) {
            element.classlist.add("completed");
            AudioEngine.play("click");
        } else {
            element.classlist.remove("completed");
        }

        // Update and save
        const task = this.savedTasks.find(t => t.id === id);
        if (task) task.completed = isChecked;
        this.save();
    },

    remove(id, element) {
        // Animate out
        element.style.transform = "scale(0.9)";
        element.style.opacity = "0";

        setTimeout(() => {
            element.remove();

            this.savedTasks = this.savedTasks.filter(t => t.id !== id);
            this.save();
        }, 200);
    },

    save() {
        Storage.set("tasks", this.savedTasks);
    }
}

