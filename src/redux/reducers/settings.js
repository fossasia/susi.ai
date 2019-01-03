import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';
import { invertColor } from '../../utils/invertColor';

const defaultState = {
  theme: 'light',
  server: 'https://api.susi.ai',
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
  customThemeValue: {
    header: '#4285f4',
    pane: '#f3f2f4',
    body: '#fff',
    composer: '#f3f2f4',
    textarea: '#fff',
    button: '#4285f4',
    textColor: '#000',
  },
  localStorage: true,
  countryCode: 'US',
  countryDialCode: '+1',
  phoneNo: '',
  checked: false,
  serverUrl: 'https://api.susi.ai',
  backgroundImage: '',
  messageBackgroundImage: '',
};

export default handleActions(
  {
    [actionTypes.SETTINGS_GET_USER_SETTINGS](state, { payload }) {
      // TODO
      // server sending string values
      // Handle customThemeValues
      return {
        ...payload.settings,
        customThemeValue: {
          header: '#4285f4',
          pane: '#f3f2f4',
          body: '#fff',
          composer: '#f3f2f4',
          textarea: '#fff',
          button: '#4285f4',
          textColor: '#000',
        },
      };
    },
    [actionTypes.SETTINGS_SET_USER_SETTINGS](state, { payload }) {
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
      console.log(payload);
      return {
        ...state,
      };
    },

    [actionTypes.SETTINGS_SET_ACCOUNT_SETTINGS](state, { payload }) {
      const { userName, timeZone, prefLanguage } = payload;
      return {
        ...state,
        userName,
        timeZone,
        prefLanguage,
      };
    },
    [actionTypes.SETTINGS_SET_MOBILE_SETTINGS](state, { payload }) {
      const { phoneNo, countryCode, countryDialCode } = payload;
      return {
        ...state,
        phoneNo,
        countryCode,
        countryDialCode,
      };
    },
    [actionTypes.SETTINGS_SET_CHAT_PREFERENCES_SETTINGS](state, { payload }) {
      const { enterAsSend } = payload;
      return {
        ...state,
        enterAsSend,
      };
    },
    [actionTypes.SETTINGS_SET_THEME_SETTINGS](state, { payload }) {
      const { theme, customThemeValue } = payload;
      return {
        ...state,
        theme,
        customThemeValue: {
          ...customThemeValue,
          textColor: invertColor(customThemeValue.textarea),
        },
      };
    },
    [actionTypes.SETTINGS_SET_MICROPHONE_SETTINGS](state, { payload }) {
      const { micInput } = payload;
      return {
        ...state,
        micInput,
      };
    },
    [actionTypes.SETTINGS_SET_SPEECH_SETTINGS](state, { payload }) {
      const {
        speechOutput,
        speechOutputAlways,
        speechRate,
        speechPitch,
        ttsLanguage,
      } = payload;
      return {
        ...state,
        speechOutput,
        speechOutputAlways,
        speechRate,
        speechPitch,
        ttsLanguage,
      };
    },
  },
  defaultState,
);
