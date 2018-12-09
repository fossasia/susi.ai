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
  removeUserDevice: createAction(
    actionTypes.SETTINGS_REMOVE_USER_DEVICE,
    apis.removeUserDevice,
  ),
  addUserDevice: createAction(
    actionTypes.SETTINGS_ADD_USER_DEVICE,
    apis.addUserDevice,
  ),
  setUserName: createAction(
    actionTypes.SETTINGS_SET_USER_NAME,
    returnArgumentsFn,
  ),
  setEmailID: createAction(actionTypes.SETTINGS_SET_EMAILID, returnArgumentsFn),
  setTimezone: createAction(
    actionTypes.SETTINGS_SET_TIMEZONE,
    returnArgumentsFn,
  ),
  setDefaultLanguage: createAction(
    actionTypes.SETTINGS_SET_DEFAULT_LANGUAGE,
    returnArgumentsFn,
  ),
  setPhoneNumber: createAction(
    actionTypes.SETTINGS_SET_PHONE_NUMBER,
    returnArgumentsFn,
  ),
  setCountryCode: createAction(
    actionTypes.SETTINGS_SET_COUNTRY_CODE,
    returnArgumentsFn,
  ),
  setCountryDialCode: createAction(
    actionTypes.SETTINGS_SET_COUNTRY_DIALCODE,
    returnArgumentsFn,
  ),
  toggleEnterToSendMessage: createAction(
    actionTypes.SETTINGS_TOGGLE_ENTER_AS_SEND,
  ),
  setTheme: createAction(actionTypes.SETTINGS_SET_THEME, returnArgumentsFn),
  toggleCustomThemeModal: createAction(
    actionTypes.SETTINGS_TOGGLE_CUSTOM_THEME,
  ),
  toggleMicInput: createAction(actionTypes.SETTINGS_TOGGLE_MIC_INPUT),
  toggleSpeechOutput: createAction(actionTypes.SETTINGS_TOGGLE_SPEECH_OUTPUT),
  toggleSpeechOutputAlwaysOn: createAction(
    actionTypes.SETTINGS_SET_OUTPUT_ALWAYS_ON,
  ),
  setSpeechOutputRate: createAction(
    actionTypes.SETTINGS_SET_SPEECH_OUTPUT_RATE,
    returnArgumentsFn,
  ),
  setSpeechOutputPitch: createAction(
    actionTypes.SETTINGS_SET_SPEECH_OUTPUT_PITCH,
    returnArgumentsFn,
  ),
  setSpeechOutputTTSLanguage: createAction(
    actionTypes.SETTINGS_SET_SPEECH_OUTPUT_TTSLANGUAGE,
    returnArgumentsFn,
  ),
};
