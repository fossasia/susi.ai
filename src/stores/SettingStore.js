import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';
let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

class SettingStore extends EventEmitter {
    constructor() {
        super();
        this.theme = true;
    }
    getTheme() {
        return this.theme;
    }
    changeTheme(themeChanges) {
        this.theme = !this.theme;
        this.emit(CHANGE_EVENT);
    }
    handleActions(action) {
        switch (action.type) {

            case ActionTypes.THEME_CHANGED: {
                this.changeTheme(action.theme);
                break;
            }
            default: {
                // do nothing
            }
        }
    }
}
const settingStore = new SettingStore();
ChatAppDispatcher.register(settingStore.handleActions.bind(settingStore));
export default settingStore;

