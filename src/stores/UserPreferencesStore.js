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
    FeedbackState : true,
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

    getFeedbackState(){
        return _defaults.FeedbackState;
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
function checkFalse(value, valueToCheck){
    let result;
    if(value === valueToCheck){
        result = false;
    }
    else{
        result = true;
    }
    return result
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
                _defaults.FeedbackState= settings.feedbackState;
                _defaults.SpeechRate = settings.rate;
                _defaults.SpeechPitch = settings.pitch;
            }
            else{
                if(settings.hasOwnProperty('theme')){
                    _defaults.Theme = settings.theme;
                }
                if(settings.hasOwnProperty('enter_send')){
                    _defaults.EnterAsSend = checkFalse(settings.enter_send ,'false');;
                }
                if(settings.hasOwnProperty('mic_input')){
                    _defaults.MicInput =  checkFalse(settings.mic_input ,'false');
                }
                if(settings.hasOwnProperty('speech_output')){
                    _defaults.SpeechOutput = checkFalse(settings.speech_output,'false');
                }
                if(settings.hasOwnProperty('speech_always')){
                    let initSpeechOutputAlways = false;
                    if(settings.speech_always === 'true'){
                    initSpeechOutputAlways = true;
                    }
                    _defaults.SpeechOutputAlways = initSpeechOutputAlways;
                }
                if(settings.hasOwnProperty('feedback_state')){

                    _defaults.FeedbackState = checkFalse(settings.feedback_state, 'false');
                }
                if(settings.hasOwnProperty('speech_rate')){
                    let initSpeechRate = parseFloat(settings.speech_rate);
                    if(!isNaN(initSpeechRate)){
                        if(initSpeechRate >= 0.1 && initSpeechRate <=5){
                            _defaults.SpeechRate = initSpeechRate;
                        }
                    }
                }
                if(settings.hasOwnProperty('speech_pitch')){
                    let initSpeechPitch = parseFloat(settings.speech_pitch);
                    if(!isNaN(initSpeechPitch)){
                        if(initSpeechPitch >= 0 && initSpeechPitch <=2){
                            _defaults.SpeechPitch = initSpeechPitch;
                        }
                    }
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
