import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

let _searchMode = false;
let _theme = true;

let SettingStore = {
    ...EventEmitter.prototype,

    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    getSearchMode() {
        return _searchMode;
    },

    getTheme() {
        return _theme;
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

};

SettingStore.dispatchToken = ChatAppDispatcher.register(action => {

    switch (action.type) {
        case ActionTypes.SEARCH_MODE: {
            _searchMode = !_searchMode;
            SettingStore.emitChange();
            break;
        }
        case ActionTypes.THEME_CHANGED: {
            _theme = !_theme;
            SettingStore.emitChange();
            break;
        }
        default: {
            // do nothing
        }
    }
});

export default SettingStore;
