import { handleActions } from 'redux-actions';
import {
  APP_GET_USER_SETTINGS,
  SETTINGS_REMOVE_USER_DEVICE,
  SETTINGS_ADD_USER_DEVICE,
} from '../actionTypes';

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
    [APP_GET_USER_SETTINGS](state, { payload }) {
      return {
        ...state,
      };
    },
    [SETTINGS_REMOVE_USER_DEVICE](state, { payload }) {
      return {
        ...state,
      };
    },
    [SETTINGS_ADD_USER_DEVICE](state, { payload }) {
      return {
        ...state,
      };
    },
  },
  defaultState,
);
