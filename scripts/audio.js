export const AudioEngine = {
    volume: 0.5,
    
    sounds: {
        save: new Audio("assets/sounds/save_sound.wav"),
        error: new Audio("assets/sounds/error_sound.wav"),
        click: new Audio("assets/sounds/click_sound.wav"),
        button: new Audio("assets/sounds/button_sound.wav"),
        boop: new Audio("assets/sounds/boop_sound.wav"),
        bell: new Audio("assets/sounds/bell_sound.mp3"),
    },

    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0; // Stop sounds that are already playing
            sound.volume = this.volume;
            sound.play().catch(() => {});
        }
    },

    adjustVolume(v) {
        this.volume = v;
        Object.values(this.sounds).forEach(s => s.volume = v); // For sounds already playing
    }
};
