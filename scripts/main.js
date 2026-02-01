/* --- Helper functions --- */
// SFX engine
let selectedVolume = 0.5;
const saveSound = new Audio("assets/sounds/save_sound.wav");
const errorSound = new Audio("assets/sounds/error_sound.wav");
const clickSound = new Audio("assets/sounds/click_sound.wav");
const buttonSound = new Audio("assets/sounds/button_sound.wav");
const boopSound = new Audio("assets/sounds/boop_sound.wav");
const bellSound = new Audio("assets/sounds/bell_sound.mp3");

const playSound = (sound) => {
    // Reset if sound is already playing
    sound.pause();
    sound.currentTime = 0;

    // Adjust volume
    sound.volume = selectedVolume;

    // Play sound
    sound.play();
};

/* const adjustVolume = () => {

} */

// Toast logic
let toastTimeout = null;

const showToast = (type, message, style = "") => {
    const toast = document.getElementById(`${type}-toast-container`);
    const messageSpan = document.getElementById(`${type}-toast-message`);

    if (!toast || !messageSpan) return; // Safety check

    messageSpan.innerText = message;

    // Clear existing timeouts
    if (toastTimeout) clearTimeout(toastTimeout);

    // Styling
    if (style === "alert") {
        toast.classList.add("toast-alert");
        playSound(errorSound);
    } else {
        toast.classList.remove("toast-alert");
    }

    // Show it
    toast.classList.remove("toast-hidden");

    // Hide it after 3s
    toastTimeout = setTimeout(() => {
        toast.classList.add("toast-hidden");
        toastTimeout = null;
    }, 3000);
};


/* --- Timer logic --- */
let savedTime = localStorage.getItem("pomoSelectedTime");
let selectedTime = savedTime ? parseInt(savedTime) : 1500; // 25 min
let time = selectedTime;

let savedBreakTime = localStorage.getItem("pomoSelectedBreakTime");
let selectedBreakTime = savedBreakTime ? parseInt(savedBreakTime) : 300; // 5 min

let savedLongBreakTime = localStorage.getItem("pomoSelectedLongBreakTime");
let selectedLongBreakTime = savedLongBreakTime ? parseInt(savedLongBreakTime) : 900; // 15 min

let intervalId = null;

let cycleCount = 1;

const timerDialog = document.getElementById("timer-settings-dialog");

// Format time
const formatTime = () => {
    const min = Math.floor(time / 60)
        .toString()
        .padStart(2, "0");
    const sec = (time % 60).toString().padStart(2, "0");

    const formattedTime = `${min}:${sec}`;

    return formattedTime;
};

// 2. Timer itself
const updateTimer = () => {
    const formattedTime = formatTime();

    const timerNode = document.getElementById("timer");
    timerNode.textContent = formattedTime;
};

const startTimer = () => {
    // Start timer
    intervalId = setInterval(() => {
        time--;
        updateTimer();
    }, 1000);

    // Change button icon
    document
        .getElementById("start-timer-btn")
        .setAttribute(
            "src",
            "assets/buttons/pause_btn.svg",
        );
};

const stopTimer = () => {
    // Stop timer
    clearInterval(intervalId);
    intervalId = null;

    // Change button icon
    document
        .getElementById("start-timer-btn")
        .setAttribute(
            "src",
            "assets/buttons/play_btn.svg",
        );
};

const toggleTimer = () => {
    if (intervalId === null) {
        startTimer();
    } else {
        stopTimer();
    }
    playSound(clickSound);
};

const resetTimer = () => {
    if (intervalId !== null) {
        stopTimer();
    }

    if (cycleCount % 8 === 0) {
        time = selectedLongBreakTime;
    } else if (cycleCount % 2 === 0) {
        time = selectedBreakTime;
    } else {
        time = selectedTime;
    }

    updateTimer();
};

const skipTimer = () => {
    updateCycle();
};

// Timer cycle and breaks
const updateCycle = () => {
    stopTimer();
    cycleCount++;
    updateCycleCounter();
    playSound(bellSound);

    // Play completion sound

    if (cycleCount % 2 === 0) {
        if (cycleCount % 8 === 0) { // Long break every 4th break
            startLongBreak();
            return;
        }

        startBreak();
        return;
    }

    document.body.style.backgroundColor = "#f0e7db";
    resetTimer();
};

const updateCycleCounter = () => {
    document.getElementById("cycle-counter").innerText = `Cycle: ${Math.ceil(cycleCount / 2)}`;
};

const startBreak = () => {
    // Change colors optionally
    document.body.style.backgroundColor = "#d1aeae";

    // Set timer to break time
    time = selectedBreakTime;
    updateTimer();
};

const startLongBreak = () => {
    document.body.style.backgroundColor = "#b3b9c7";
    time = selectedLongBreakTime;
    updateTimer();
}

// Settings
const openTimerSettings = () => {
    document.getElementById("time-settings-input").value = (selectedTime / 60);
    timerDialog.showModal();
    playSound(buttonSound);
};

const saveTimerSettings = () => {
    // Get input value
    let timeInput = document.getElementById("time-settings-input").value;
    let breakInput = document.getElementById("break-settings-input").value;
    let longBreakInput = document.getElementById("long-break-settings-input").value;

    selectedTime = parseInt(timeInput) * 60;
    selectedBreakTime = parseInt(breakInput) * 60;
    selectedLongBreakTime = parseInt(longBreakInput) * 60;

    // Safety check
    if (
        isNaN(selectedTime) || selectedTime < 0 ||
        isNaN(breakInput) || selectedBreakTime < 0 ||
        isNaN(longBreakInput) || selectedLongBreakTime < 0
    ) {
        timerSettingsWarning();
        return;
    }

    // Save to localStorage
    localStorage.setItem("pomoSelectedTime", selectedTime);
    localStorage.setItem("pomoSelectedBreakTime", selectedBreakTime);
    localStorage.setItem("pomoSelectedLongBreakTime", selectedLongBreakTime);

    // Close dialog and reset timer
    resetTimer();
    timerDialog.close();
    showToast("general", "Settings saved", "normal");
    playSound(saveSound);
};

const timerSettingsWarning = () => {
    showToast("settings", "Please insert valid numbers in the input fields xx", "alert");
};

// Initialisation
updateTimer();
updateCycleCounter();

// Buttons
document.getElementById("start-timer-btn").addEventListener("click", () => toggleTimer());

document.getElementById("reset-timer-btn").addEventListener("click", () => {
    resetTimer();
    playSound(boopSound);
});

document.getElementById("skip-timer-btn").addEventListener("click", () => skipTimer());

document.getElementById("timer-settings-btn").addEventListener("click", () => openTimerSettings());

timerDialog.addEventListener("click", (e) => {
    const dialogDimensions = timerDialog.getBoundingClientRect();
    if (e.target === document.getElementById("close-timer-settings-btn")) {
        saveTimerSettings();
        return;
    }

    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        timerDialog.close();
        showToast("general", "Settings discarded", "alert");
    }
});

document.addEventListener("keydown", (e) => {
    if (timerDialog.open) {
        if (e.key === "Escape") {
            timerDialog.close();
            showToast("general", "Settings discarded", "alert");
            return;
        }
        if (e.key === "Enter") {
            saveTimerSettings();
            return;
        }
        return;
    }
    return;
});


/* --- Task management logic --- */


/* --- Note taking (if not on mobile) --- */


/* --- Lofi logic --- */