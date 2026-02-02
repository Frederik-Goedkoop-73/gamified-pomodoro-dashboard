export const UI = {
    elements: {
        // Main DOM targets
        timer: document.getElementById("timer"),
        cycle: document.getElementById("cycle-counter"),
        body: document.body,
        title: document.getElementById("title"),

        // Timer settings DOM targets
        timerDialog: document.getElementById("timer-settings-dialog"),
        workTimeField: document.getElementById("time-settings-input"),
        breakTimeField: document.getElementById("break-settings-input"),
        longBreakTimeField: document.getElementById("long-break-settings-input"),

        // Tasks DOM targets
        taskContainer: document.getElementById("task-container"),
        addTaskField: document.getElementById("task-input"),

        // Timer DOM listeners
        startBtn: document.getElementById("start-timer-btn"),
        resetBtn: document.getElementById("reset-timer-btn"),
        pomoResetBtn: document.getElementById("reset-pomodoro-btn"),
        skipBtn: document.getElementById("skip-timer-btn"),
        settingsBtn: document.getElementById("timer-settings-btn"),
        closeSettingsBtn: document.getElementById("close-timer-settings-btn"),

        // Tasks DOM listeners
        addTaskBtn: document.getElementById("add-task-btn"),

    },

    // Timer methods
    renderTime(timeStr, selectedTask = "") {
        this.elements.timer.textContent = timeStr;
        
        if (selectedTask !== "") {
            this.elements.title.textContent = `${timeStr} – ${selectedTask}`;
            return;
        }
        this.elements.title.textContent = `${timeStr} – LOFI Pomodoro`
    },

    setTheme(mode) {
        const themes = {
            work: "#f0e7db",
            break: "#d1aeae",
            long: "#b3b9c7"
        };
        this.elements.body.style.backgroundColor = themes[mode] || themes.work;
    },

    toggleStartButton(isRunning) {
        const icon = isRunning ? "pause_btn.svg" : "play_btn.svg";
        this.elements.startBtn.src = `assets/buttons/${icon}`;
    },

    renderCycle(count) {
        this.elements.cycle.innerText = `# ${Math.ceil(count / 2)}`;
    },

    toggleTimerDialog(status) {
        if (status === "open") {
            this.timerDialog.showModal();
        } else {
            this.timerDialog.close();
        }
    },

    // Tasks methods
    addTask() {
        const taskNode = document.createElement("p");
        taskNode.textContent = this.elements.addTaskField.value;

        this.elements.taskContainer.appendChild(taskNode);
    }
};