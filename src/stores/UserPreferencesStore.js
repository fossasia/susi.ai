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
    SpeechOutput: true,
    SpeechOutputAlways: false,
    SpeechRate: 1,
    SpeechPitch: 1,
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

    getSpeechOutput(){
        return _defaults.SpeechOutput;
    },

    getSpeechOutputAlways(){
        return _defaults.SpeechOutputAlways;
    },

    getSpeechRate(){
        return _defaults.SpeechRate;
    },

    getSpeechPitch(){
        return _defaults.SpeechPitch;
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

        case ActionTypes.SPEECH_OUTPUT_CHANGED: {
            _defaults.SpeechOutput = action.speechOutput;
            UserPreferencesStore.emitChange();
            break;
        }

        case ActionTypes.SPEECH_OUTPUT_ALWAYS_CHANGED: {
            _defaults.SpeechOutputAlways = action.speechOutputAlways;
            UserPreferencesStore.emitChange();
            break;
        }

        case ActionTypes.SPEECH_RATE_CHANGED: {
            _defaults.SpeechRate = action.rate;
            UserPreferencesStore.emitChange();
            break;
        }

        case ActionTypes.SPEECH_PITCH_CHANGED: {
            _defaults.SpeechPitch = action.pitch;
            UserPreferencesStore.emitChange();
            break;
        }

        case ActionTypes.INIT_SETTINGS: {
            let settings = action.settings;
            if(settings.hasOwnProperty('LocalStorage')){
                _defaults.Theme = settings.theme;
                _defaults.EnterAsSend = settings.enterAsSend;
                _defaults.MicInput = settings.micInput;
                _defaults.SpeechOutput = settings.speechOutput;
                _defaults.SpeechOutputAlways = settings.speechOutputAlways;
            }
            else{
                if(settings.hasOwnProperty('theme')){
                    _defaults.Theme = settings.theme;
                }
                if(settings.hasOwnProperty('enter_send')){
                    let initEnterAsSend = true;
                    if(settings.enter_send === 'false'){
                        initEnterAsSend = false;
                    }
                    _defaults.EnterAsSend = initEnterAsSend;
                }
                if(settings.hasOwnProperty('mic_input')){
                    let initMicInput = true;
                    if(settings.mic_input === 'false'){
                        initMicInput = false;
                    }
                    _defaults.MicInput = initMicInput;
                }
                if(settings.hasOwnProperty('speech_output')){
                    let initSpeechOutput = true;
                    if(settings.speech_output === 'false'){
                        initSpeechOutput = false;
                    }
                    _defaults.SpeechOutput = initSpeechOutput;
                }
                if(settings.hasOwnProperty('speech_always')){
                    let initSpeechOutputAlways = false;
                    if(settings.speech_always === 'true'){
                        initSpeechOutputAlways = true;
                    }
                    _defaults.SpeechOutputAlways = initSpeechOutputAlways;
                }
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
