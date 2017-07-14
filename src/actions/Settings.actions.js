import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import * as Actions from './API.actions';

let ActionTypes = ChatConstants.ActionTypes;

export function serverChanged(server){
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SERVER_CHANGED,
    server
  });
}

export function themeChanged(theme) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.THEME_CHANGED,
    theme
  });
  Actions.setThemeSettings(theme);
};

export function enterAsSendChanged(enterAsSend) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.ENTER_AS_SEND_CHANGED,
    enterAsSend
  });
  Actions.setEnterAsSendSettings(enterAsSend);
}

export function micInputChanged(micInput) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.MIC_INPUT_CHANGED,
    micInput
  });
  Actions.setMicInputSettings(micInput);
}

export function speechOutputChanged(speechOutput) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SPEECH_OUTPUT_CHANGED,
    speechOutput
  });
  Actions.setSpeechOutputSettings(speechOutput);
}

export function speechOutputAlwaysChanged(speechOutputAlways) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SPEECH_OUTPUT_ALWAYS_CHANGED,
    speechOutputAlways
  });
  Actions.setSpeechOutputAlwaysSettings(speechOutputAlways);
}

export function speechRateChanged(rate) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SPEECH_RATE_CHANGED,
    rate
  });
}

export function speechPitchChanged(pitch) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SPEECH_PITCH_CHANGED,
    pitch
  });
}

export function initialiseSettings(settings) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.INIT_SETTINGS,
    settings
  });
};
