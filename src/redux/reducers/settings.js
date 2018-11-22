import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const defaultState = {
  theme: 'light',
  previewTheme: 'light',
  server: '',
  standardServer: '',
  enterAsSend: true,
  micInput: true,
  speechOutput: true,
  speechOutputAlways: false,
  speechRate: 1,
  speechPitch: 1,
  ttsLanguage: 'en-US',
  userName: '',
  prefLanguage: 'en-US',
  timeZone: 'UTC-02',
  themeValues: '',
  localStorage: true,
  countryCode: 'US',
  countryDialCode: '+1',
  phoneNo: '',
  checked: false,
  serverUrl: '',
  backgroundImage: '',
};

export default handleActions(
  {
    [actionTypes.APP_GET_USER_SETTINGS](state, { payload }) {
      return {
        ...state,
      };
    },
    [actionTypes.SETTINGS_REMOVE_USER_DEVICE](state, { payload }) {
      return {
        ...state,
      };
    },
    [actionTypes.SETTINGS_ADD_USER_DEVICE](state, { payload }) {
      return {
        ...state,
      };
    },
  },
  defaultState,
);
