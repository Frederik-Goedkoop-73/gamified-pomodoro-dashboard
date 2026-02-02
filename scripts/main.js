import { Timer } from "./timer.js";
import { UI } from "./ui.js";
import { AudioEngine } from "./audio.js";

// Initialisation
Timer.update();
Timer.updateCycleCounter();

// Listeners to start functions
// ...
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
})