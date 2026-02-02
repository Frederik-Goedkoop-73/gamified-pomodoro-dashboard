export const Storage = {
    // Get
    get(key, defaultValue = null) {
        const val = localStorage.getItem(key);
        if (val === null) return defaultValue;
        
        // If val looks like number -> Parse like number
        return !isNaN(val) ? parseInt(val) : val;
    },

    // Set
    set(name, val) {
        return localStorage.setItem(name, val);
    }
};