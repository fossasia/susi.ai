import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

export default {
  getUserSettings: createAction(
    actionTypes.SETTINGS_GET_USER_SETTINGS,
    apis.getUserSettings,
  ),
  setUserSettings: createAction(
    actionTypes.SETTINGS_SET_USER_SETTINGS,
    apis.setUserSettings,
  ),
  removeUserDevice: createAction(
    actionTypes.SETTINGS_REMOVE_USER_DEVICE,
    apis.removeUserDevice,
  ),
  addUserDevice: createAction(
    actionTypes.SETTINGS_ADD_USER_DEVICE,
    apis.addUserDevice,
  ),

  setAccountSettings: createAction(
    actionTypes.SETTINGS_SET_ACCOUNT_SETTINGS,
    returnArgumentsFn,
  ),
  setMobileSettings: createAction(
    actionTypes.SETTINGS_SET_MOBILE_SETTINGS,
    returnArgumentsFn,
  ),
  setChatPreferencesSettings: createAction(
    actionTypes.SETTINGS_SET_CHAT_PREFERENCES_SETTINGS,
    returnArgumentsFn,
  ),
  setThemeSettings: createAction(
    actionTypes.SETTINGS_SET_THEME_SETTINGS,
    returnArgumentsFn,
  ),
  setMicrophoneSettings: createAction(
    actionTypes.SETTINGS_SET_MICROPHONE_SETTINGS,
    returnArgumentsFn,
  ),
  setSpeechSettings: createAction(
    actionTypes.SETTINGS_SET_SPEECH_SETTINGS,
    returnArgumentsFn,
  ),
};
