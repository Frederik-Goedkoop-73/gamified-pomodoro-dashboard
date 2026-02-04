import { Storage } from "./storage.js";

export const Notes = {
    notesElement: document.getElementById("notes-field"),

    savedNotes: Storage.get("notes", "Example note"),

    init() {
        if (!this.notesElement) return;

        this.render(this.savedNotes);
    },

    render(text) {
        this.notesElement.value = text;
        this.autoscale();

        this.notesElement.addEventListener("input", () => {
            this.autoscale();
            this.savedNotes = this.notesElement.value;
            this.save();
        });
    },

    save() {
        Storage.set("notes", this.savedNotes);
    },

    // Autoscale the UI container
    autoscale() {
        this.notesElement.style.height = "auto"; // Reset if text is deleted
        this.notesElement.style.height = this.notesElement.scrollHeight + "px";
    }
}