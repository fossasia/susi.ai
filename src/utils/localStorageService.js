let localStorageService = {
  set: function(key, value) {
    try {
      let localStorage = window.localStorage;
      localStorage.setItem(key, value);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  },
  get: function(key) {
    try {
      let localStorage = window.localStorage;
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
};

export default localStorageService;
