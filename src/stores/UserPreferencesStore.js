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
    if(valueToCheck===false){
        return false;
    }
    return true;
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
            Object.keys(settings).forEach((key) => {
                _defaults[key] = settings[key];
            });
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
                _defaults.SpeechRate = settings.rate;
                _defaults.SpeechPitch = settings.pitch;
                _defaults.TTSLanguage = settings.lang;
                _defaults.PrefLanguage = settings.PrefLanguage;
                _defaults.ThemeValues = settings.custom_theme_value;
            }
            else{
                if(settings.hasOwnProperty('theme')){
                    _defaults.Theme = settings.theme;
                }
                if(settings.hasOwnProperty('enter_send')){
                    _defaults.EnterAsSend = checkForFalse(settings.enter_send);
                }
                if(settings.hasOwnProperty('mic_input')){
                    _defaults.MicInput = checkForFalse(settings.mic_input);
                }
                if(settings.hasOwnProperty('speech_output')){
                    _defaults.SpeechOutput = checkForFalse(settings.speech_output);
                }
                if(settings.hasOwnProperty('speech_always')){
                    let initSpeechOutputAlways = false;
                    if(settings.speech_always === 'true'){
                        initSpeechOutputAlways = true;
                    }
                    _defaults.SpeechOutputAlways = initSpeechOutputAlways;
                }
                if(settings.hasOwnProperty('speech_rate')){
                    let initSpeechRate = parseFloat(settings.speech_rate);
                    if(!isNaN(initSpeechRate)){
                        _defaults.SpeechRate = initSpeechRate;
                    }
                }
                if(settings.hasOwnProperty('speech_pitch')){
                    let initSpeechPitch = parseFloat(settings.speech_pitch);
                    if(!isNaN(initSpeechPitch)){
                        _defaults.SpeechPitch = initSpeechPitch;
                    }
                }
                if(settings.hasOwnProperty('speech_lang')){
                  _defaults.TTSLanguage = settings.speech_lang;
                }
                if(settings.hasOwnProperty('pref_lang')){
                    settings.PrefLanguage = settings.pref_lang;
                  _defaults.PrefLanguage = settings.pref_lang;
                  console.log(_defaults.PrefLanguage);
                }
                  if(settings.hasOwnProperty('custom_theme_value')){
                    _defaults.ThemeValues = settings.custom_theme_value;
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
