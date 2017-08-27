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
    TTSLanguage: 'en-US',
    PrefLanguage : 'en-US',
    ThemeValues: ''

};
// Store handling all User Preferences
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

    getThemeValues(){
        return _defaults.ThemeValues;
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

    getTTSLanguage(){
      return _defaults.TTSLanguage;
    },

    getPrefLang(){
        return _defaults.PrefLanguage;
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

};

function checkForFalse ( valueToCheck ){
    if(valueToCheck==='false'){
        return false;
    }
    return true;
}

function checkForTrue ( valueToCheck ){
    if(valueToCheck==='true'){
        return true;
    }
    return false;
}

UserPreferencesStore.dispatchToken = ChatAppDispatcher.register(action => {

    switch (action.type) {

        case ActionTypes.SERVER_CHANGED: {
            _defaults.Server = action.server;
            UserPreferencesStore.emitChange();
            break;
        }

        case ActionTypes.SETTINGS_CHANGED: {
            let settings = action.settings;
            _defaults.Theme = settings.theme;
            _defaults.EnterAsSend = settings.enterAsSend;
            _defaults.MicInput = settings.micInput;
            _defaults.SpeechOutput = settings.speechOutput;
            _defaults.SpeechOutputAlways = settings.speechOutputAlways;
            _defaults.SpeechRate = settings.speechRate;
            _defaults.SpeechPitch = settings.speechPitch;
            _defaults.TTSLanguage = settings.ttsLanguage;
            _defaults.PrefLanguage = settings.prefLanguage;
            _defaults.ThemeValues = settings.custom_theme_value;
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
                _defaults.SpeechRate = settings.speechRate;
                _defaults.SpeechPitch = settings.speechPitch;
                _defaults.TTSLanguage = settings.ttsLanguage;
                _defaults.PrefLanguage = settings.prefLanguage;
                _defaults.ThemeValues = settings.customThemeValue;
            }
            else{
                if(settings.hasOwnProperty('theme')){
                    _defaults.Theme = settings.theme;
                }
                if(settings.hasOwnProperty('enterAssend')){
                    _defaults.EnterAsSend = checkForFalse(settings.enterAssend);
                }
                if(settings.hasOwnProperty('micInput')){
                    _defaults.MicInput = checkForFalse(settings.micInput);
                }
                if(settings.hasOwnProperty('speechOutput')){
                    _defaults.SpeechOutput = checkForFalse(settings.speechOutput);
                }
                if(settings.hasOwnProperty('speechOutputAlways')){
                    _defaults.SpeechOutputAlways = checkForTrue(
                                                    settings.speechOutputAlways);
                }
                if(settings.hasOwnProperty('speechRate')){
                    let initSpeechRate = parseFloat(settings.speechRate);
                    if(!isNaN(initSpeechRate)){
                        _defaults.SpeechRate = initSpeechRate;
                    }
                }
                if(settings.hasOwnProperty('speechPitch')){
                    let initSpeechPitch = parseFloat(settings.speechPitch);
                    if(!isNaN(initSpeechPitch)){
                        _defaults.SpeechPitch = initSpeechPitch;
                    }
                }
                if(settings.hasOwnProperty('ttsLanguage')){
                  _defaults.TTSLanguage = settings.ttsLanguage;
                }
                if(settings.hasOwnProperty('prefLanguage')){
                  _defaults.PrefLanguage = settings.prefLanguage;
                }
                if(settings.hasOwnProperty('customThemeValue')){
                    _defaults.ThemeValues = settings.customThemeValue;
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
