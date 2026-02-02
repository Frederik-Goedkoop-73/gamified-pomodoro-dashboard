import { AudioEngine } from "./audio.js";

export const Toast = {
    timeoutId: null,

    // Internal helper so we don't repeat code
    _show(id, msg, isAlert) {
        const container = document.getElementById(`${id}-toast-container`);
        const messageSpan = document.getElementById(`${id}-toast-message`);

        if (!container || !messageSpan) return;

        messageSpan.innerText = msg;

        // Reset state
        if (this.timeoutId) clearTimeout(this.timeoutId);
        container.classList.remove("toast-hidden");

        // Handle styling/sound
        if (isAlert) {
            container.classList.add("toast-alert");
            AudioEngine.play("error");
        } else {
            container.classList.remove("toast-alert");
        }

        // Auto-hide
        this.timeoutId = setTimeout(() => {
            container.classList.add("toast-hidden");
            this.timeoutId = null;
        }, 3000);
    },

    // Public methods
    normal(id, msg) {
        this._show(id, msg, false);
    },

    alert(id, msg) {
        this._show(id, msg, true);
    }
};