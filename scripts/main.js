import { Timer } from "./timer.js";
import { UI } from "./ui.js";
import { AudioEngine } from "./audio.js";
import { Tasks } from "./tasks.js";
import { Notes } from "./notes.js";

// Initialisation
Timer.init();
Tasks.init();
Notes.init();

// Listeners to start functions
// Navbar
const smoothScrollTo = (target) => {
    document.querySelector(target).scrollIntoView({
        behavior: "smooth"
    });
}

UI.elements.toTimerBtn.addEventListener("click", () => smoothScrollTo("#timer-section"));
UI.elements.toTasksBtn.addEventListener("click", () => smoothScrollTo("#task-section"));
UI.elements.toNotesBtn.addEventListener("click", () => smoothScrollTo("#notes-section"));
UI.elements.toLofiBtn.addEventListener("click", () => smoothScrollTo("#lofi-section"));

// Timer
UI.elements.startBtn.addEventListener("click", () => {
    Timer.toggle();
    AudioEngine.play("click");
});
UI.elements.skipBtn.addEventListener("click", () => {
    Timer.updateCycle();
    AudioEngine.play("error");
});
UI.elements.resetBtn.addEventListener("click", () => {
    Timer.reset();
    AudioEngine.play("boop");
});
UI.elements.pomoResetBtn.addEventListener("click", () => {
    Timer.sessionReset();
    AudioEngine.play("error");
})
UI.elements.settingsBtn.addEventListener("click", () => {
    Timer.openSettings();
    AudioEngine.play("button");
});

UI.elements.timerDialog.addEventListener("click", (e) => {
    const dialogDimensions = UI.elements.timerDialog.getBoundingClientRect();
    if (e.target === UI.elements.closeSettingsBtn) {
        Timer.saveSettings();
        UI.elements.timerDialog.close();
        return;
    }    
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        UI.elements.timerDialog.close();
        AudioEngine.play("button");
    }
});
UI.elements.timerDialog.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        Timer.saveSettings();
        UI.elements.timerDialog.close();
        return;
    }
});

// Tasks
const taskInput = document.getElementById("task-input");
document.getElementById("add-task-btn").addEventListener("click", () => {
    const text = taskInput.value;
    if (text.trim() !== "") {
        Tasks.add(text);
        taskInput.value = "";
    }
})

// Notes
