// Saves and loads data in the browser (localStorage).
// Wrapped in try/catch so the app still works if storage is blocked.

const Store = {
  load(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore: storage unavailable
    }
  }
};
