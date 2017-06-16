import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

let _defaults = {
    Theme: 'light',
    Server: 'http://api.susi.ai',
    StandardServer: 'http://api.susi.ai'
};

let UserPreferencesStore = {
    ...EventEmitter.prototype,

    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    getPreferences() {
        return _defaults;
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

};

UserPreferencesStore.dispatchToken = ChatAppDispatcher.register(action => {

    switch (action.type) {

        case ActionTypes.DEFAULT_THEME_CHANGED: {
            let newDefaultTheme = action.defaultTheme;
            _defaults.Theme = newDefaultTheme;
            console.log(_defaults);
            UserPreferencesStore.emitChange();
            break;
        }
        case ActionTypes.DEFAULT_SERVER_CHANGED: {
            let newDefaultServer = action.defaultServer;
            _defaults.Server = newDefaultServer;
            console.log(_defaults);
            UserPreferencesStore.emitChange();
            break;
        }
        default: {
            // do nothing
        }
    }
});

export default UserPreferencesStore;
