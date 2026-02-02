import { AudioEngine } from "./audio.js";
import { Storage } from "./storage.js";
import { UI } from "./ui.js";
import { Toast } from "./toast.js";

export const Timer = {
    intervalId: null,

    // Check storage
    cycleCount: Storage.get("cycleCount", 1),
    completedCyclesCount: Storage.get("completedCyclesCount", 0),

    workTime: Storage.get("workTime", 1500),
    breakTime: Storage.get("breakTime", 300),
    longBreakTime: Storage.get("longBreakTime", 900),

    time: Storage.get("timeLeft", 1500), // Time left

    formattedTime: null,

    _formatTime() {
        const h = Math.floor(this.time / 3600)
            .toString()
            .padStart(2, "0");
        const min = Math.floor((this.time % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const sec = (this.time % 60).
            toString().
            padStart(2, "0");

        if (parseInt(h) === 0) {
            return `${min}:${sec}`;
        } else {
            return `${h}:${min}:${sec}`;
        }
    },

    start() {
        this.intervalId = setInterval(() => {
            this.time--;
            this.update();
        }, 1000);

        UI.toggleStartButton(true);
    },

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;

        UI.toggleStartButton(false);
    },

    toggle() {
        if (this.intervalId === null) {
            this.start();
            UI.toggleStartButton(true);
        } else {
            this.stop();
            UI.toggleStartButton(false);
        }
        AudioEngine.play("click");
    },

    reset() {
        if (this.intervalId !== null) {
            this.stop();
        }

        if (this.cycleCount % 8 === 0) {
            this.time = this.longBreakTime;
        } else if (this.cycleCount % 2 === 0) {
            this.time = this.breakTime;
        } else {
            this.time = this.workTime;
        }

        this.update();
    },

    sessionReset() {
        this.cycleCount = 1;
        this.time = this.workTime;
        this.switchMode("work");

        this.reset();
    },

    settingsReset() {
        this.workTime = 1500;
        this.breakTime = 300;
        this.longBreakTime = 900;
        
        Storage.set("workTime", this.workTime);
        Storage.set("breakTime", this.breakTime);
        Storage.set("longBreakTime", this.longBreakTime);
    },

    // Updates
    update() {
        Storage.set("timeLeft", this.time);
        this.formattedTime = this._formatTime();
        UI.renderTime(this.formattedTime);
    },

    updateCycleCounter() {
        UI.renderCycle(this.cycleCount);
    },

    updateCycle() {
        this.stop();
        this.cycleCount++;
        this.updateCycleCounter();

        if (this.cycleCount % 8 === 0) {
            this.switchMode("long");
        } else if (this.cycleCount % 2 === 0) {
            this.switchMode("break");
        } else {
            this.switchMode("work");
        }

        this.reset();
    },

    switchMode(mode) {
        if (mode === "break") {
            UI.setTheme(mode);
            this.time = this.breakTime;
        } else if (mode === "long") {
            UI.setTheme(mode);
            this.time = this.longBreakTime;
        } else {
            UI.setTheme(mode);
            this.time = this.workTime;
        }
    },

    // Settings
    openSettings() {
        UI.elements.workTimeField.value = this.workTime / 60;
        UI.breakTimeField = this.breakTime / 60;
        UI.longBreakTimeField = this.longBreakTime / 60;

        UI.elements.timerDialog.showModal();
    },

    saveSettings() {
        const workTime = parseInt(UI.elements.workTimeField.value);
        const breakTime = parseInt(UI.elements.breakTimeField.value);
        const longBreakTime = parseInt(UI.elements.longBreakTimeField.value);
        
        if (
            isNaN(workTime) || workTime < 0 ||
            isNaN(breakTime) || breakTime < 0 ||
            isNaN(longBreakTime) || longBreakTime < 0
        ) {
            Toast.alert("general", "Please enter valid numbers in the fields provided");
            return;
        }

        this.workTime = workTime * 60;
        this.breakTime = breakTime * 60;
        this.longBreakTime = longBreakTime * 60;

        // Save to storage
        Storage.set("workTime", this.workTime);
        Storage.set("breakTime", this.breakTime);
        Storage.set("longBreakTime", this.longBreakTime);

        // Play save sound
        AudioEngine.play("save");

        // Save toast
        Toast.normal("general", "Changes saved");

        this.reset();
    },
}