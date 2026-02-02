import { Timer } from "./timer.js";
import { UI } from "./ui.js";
import { AudioEngine } from "./audio.js";
import { Toast } from "./toast.js";

// Initialisation
Timer.init();

// Listeners to start functions
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
UI.elements.addTaskBtn.addEventListener("click", () => {
    if (UI.elements.addTaskField.value !== "") {
        UI.addTask();
        AudioEngine.play("button");
    } else {
        Toast.alert("general", "Please input a task first");
    }
})