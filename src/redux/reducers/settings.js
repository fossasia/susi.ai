import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const defaultState = {
  theme: 'light',
  server: 'https://api.susi.ai',
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
  },
  localStorage: true,
  countryCode: 'US',
  countryDialCode: '+1',
  phoneNo: '',
  checked: false,
  serverUrl: 'https://api.susi.ai',
  backgroundImage: '',
  messageBackgroundImage: '',
  avatarType: 'default',
  devices: {},
};

export default handleActions(
  {
    [actionTypes.SETTINGS_GET_USER_SETTINGS](state, { error, payload }) {
      const { settings, devices = {} } = payload;
      if (error || !settings) {
        return state;
      }

      const {
        theme = defaultState.theme,
        server,
        serverUrl,
        enterAsSend,
        micInput,
        speechOutput,
        speechOutputAlways,
        speechRate,
        speechPitch,
        ttsLanguage,
        userName,
        prefLanguage,
        timeZone,
        countryCode,
        countryDialCode,
        phoneNo,
        checked,
        backgroundImage,
        messageBackgroundImage,
        avatarType,
      } = settings;
      let { customThemeValue } = settings;
      const themeArray = customThemeValue
        ? customThemeValue.split(',').map(value => `#${value}`)
        : defaultState.customThemeValue;
      return {
        ...state,
        devices,
        server,
        serverUrl,
        theme,
        enterAsSend: enterAsSend === 'true',
        micInput: micInput === 'true',
        speechOutput: speechOutput === 'true',
        speechOutputAlways: speechOutputAlways === 'true',
        speechRate: Number(speechRate),
        speechPitch: Number(speechPitch),
        ttsLanguage,
        userName,
        prefLanguage,
        timeZone,
        countryCode,
        countryDialCode,
        phoneNo,
        checked: checked === 'true',
        backgroundImage,
        messageBackgroundImage,
        avatarType,
        customThemeValue: {
          header: themeArray[0],
          pane: themeArray[1],
          body: themeArray[2],
          composer: themeArray[3],
          textarea: themeArray[4],
          button: themeArray[5],
        },
      };
    },
    [actionTypes.SETTINGS_SET_USER_SETTINGS](state, { payload }) {
      return {
        ...state,
        ...payload,
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
