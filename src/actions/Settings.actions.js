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

export function initialiseSettings(settings) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.INIT_SETTINGS,
    settings
  });
};
