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

    getTheme(){
        return _defaults.Theme;
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

        case ActionTypes.THEME_CHANGED: {
            _defaults.Theme = action.theme;
            UserPreferencesStore.emitChange();
            break;
        }
        case ActionTypes.SERVER_CHANGED: {
            _defaults.Server = action.server;
            UserPreferencesStore.emitChange();
            break;
        }
        case ActionTypes.INIT_SETTINGS: {
            let settings = action.settings;
            if(settings.hasOwnProperty('theme')){
                _defaults.Theme = settings.theme;
            }
            UserPreferencesStore.emitChange();
            break;
        }
        default: {
            // do nothing
        }
    }
});

export default UserPreferencesStore;
