let storageService = {
  getStorageFromType: function(storageType) {
    let storage = null;
    if (storageType === 'local') {
      storage = window.localStorage;
    } else if (storageType === 'session') {
      storage = window.sessionStorage;
    }

    return storage;
  },

  set: function(key, value, storageType) {
    try {
      let storage = this.getStorageFromType(storageType);
      storage.setItem(key, value);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  },

  get: function(key, storageType) {
    try {
      let storage = this.getStorageFromType(storageType);
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  },
};

export default storageService;
