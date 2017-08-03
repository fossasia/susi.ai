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

export function settingsChanged(settings) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SETTINGS_CHANGED,
    settings
  });
  Actions.pushSettingsToServer(settings);
}

export function initialiseSettings(settings) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.INIT_SETTINGS,
    settings
  });
}

export function initialiseTTSVoices(voiceList) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.INIT_TTS_VOICES,
    voiceList
  });
}
