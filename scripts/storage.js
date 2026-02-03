export const Storage = {
    // Get
    get(key, defaultValue = null) {
        const val = localStorage.getItem(key);
        if (val === null) return defaultValue;

        // If val looks like number -> Parse like number
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    },

    // Set
    set(key, val) {
        return localStorage.setItem(key, JSON.stringify(val));
    }
};