import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

// const returnArgumentsFn = function(payload) {
//   return Promise.resolve(payload);
// };

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
    apis.setUserSettings,
  ),
  setMobileSettings: createAction(
    actionTypes.SETTINGS_SET_MOBILE_SETTINGS,
    apis.setUserSettings,
  ),
  setChatPreferencesSettings: createAction(
    actionTypes.SETTINGS_SET_CHAT_PREFERENCES_SETTINGS,
    apis.setUserSettings,
  ),
  setThemeSettings: createAction(
    actionTypes.SETTINGS_SET_THEME_SETTINGS,
    apis.setUserSettings,
  ),
  setMicrophoneSettings: createAction(
    actionTypes.SETTINGS_SET_MICROPHONE_SETTINGS,
    apis.setUserSettings,
  ),
  setSpeechSettings: createAction(
    actionTypes.SETTINGS_SET_SPEECH_SETTINGS,
    apis.setUserSettings,
  ),
};
