import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

let _defaults = {
    Theme: 'light',
    Server: 'http://api.susi.ai',
    StandardServer: 'http://api.susi.ai',
    EnterAsSend: true,
    MicInput: true,
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

    getEnterAsSend(){
        return _defaults.EnterAsSend;
    },

    getMicInput(){
        return _defaults.MicInput;
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
        case ActionTypes.ENTER_AS_SEND_CHANGED: {
            _defaults.EnterAsSend = action.enterAsSend;
            UserPreferencesStore.emitChange();
            break;
        }
        case ActionTypes.MIC_INPUT_CHANGED: {
            _defaults.MicInput = action.micInput;
            UserPreferencesStore.emitChange();
            break;
        }
        case ActionTypes.INIT_SETTINGS: {
            let settings = action.settings;
            if(settings.hasOwnProperty('theme')){
                _defaults.Theme = settings.theme;
            }
            if(settings.hasOwnProperty('enter_send')){
                let initEnterAsSend = true;
                switch(settings.enter_as_send){
                    case 'true':{
                        initEnterAsSend = true;
                        break;
                    }
                    case 'false':{
                        initEnterAsSend = false;
                        break;
                    }
                    default: {
                        // do nothing
                    }
                }
                _defaults.EnterAsSend = initEnterAsSend;
            }
            if(settings.hasOwnProperty('mic_input')){
                let initMicInput = true;
                switch(settings.mic_input){
                    case 'true':{
                        initMicInput = true;
                        break;
                    }
                    case 'false':{
                        initMicInput = false;
                        break;
                    }
                    default: {
                        // do nothing
                    }
                }
                _defaults.MicInput = initMicInput;
            }
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
