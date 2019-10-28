import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';
import urls from '../../utils/urls';

const config = {
  theme: 'light',
  server: urls.API_URL,
  enterAsSend: true,
  micInput: true,
  speechOutput: true,
  speechOutputAlways: false,
  speechRate: 1,
  speechPitch: 1,
  ttsLanguage: 'en-US',
  userName: '',
  userSettingsLoaded: false,
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
  serverUrl: urls.API_URL,
  backgroundImage: '',
  messageBackgroundImage: '',
  avatarType: 'default',
};

const defaultState = {
  ...config,
  devices: {},
  userSettingsViewedByAdmin: {
    ...config,
    email: '',
  },
};

export default handleActions(
  {
    [actionTypes.SETTINGS_GET_USER_SETTINGS](state, { error, payload }) {
      const { settings } = payload;
      const email =
        payload.requestPayload && payload.requestPayload.email
          ? payload.requestPayload.email
          : null;
      if (error || !settings) {
        return state;
      }

      const {
        theme = config.theme,
        server = config.server,
        serverUrl = config.serverUrl,
        enterAsSend = config.enterAsSend,
        micInput = config.micInput,
        speechOutput = config.speechOutput,
        speechOutputAlways = config.speechOutputAlways,
        speechRate = config.speechRate,
        speechPitch = config.speechPitch,
        ttsLanguage = config.ttsLanguage,
        userName = config.userName,
        prefLanguage = config.prefLanguage,
        timeZone = config.timeZone,
        countryCode = config.countryCode,
        countryDialCode = config.countryDialCode,
        phoneNo = config.phoneNo,
        checked = config.checked,
        backgroundImage = config.backgroundImage,
        messageBackgroundImage = config.messageBackgroundImage,
        avatarType = config.avatarType,
      } = settings;
      let { customThemeValue } = settings;
      const themeArray = customThemeValue
        ? customThemeValue.split(',').map(value => `#${value}`)
        : defaultState.customThemeValue;

      let userSettings = {
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
        userSettingsLoaded: true,
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
      let userSettingsViewedByAdmin = email
        ? { ...userSettings, email }
        : defaultState.userSettingsViewedByAdmin;
      userSettings = email ? {} : userSettings;
      return {
        ...state,
        ...userSettings,
        userSettingsViewedByAdmin,
      };
    },
    [actionTypes.SETTINGS_SET_USER_SETTINGS](state, { payload }) {
      let userSettings = { ...payload };
      const { email } = state.userSettingsViewedByAdmin;
      let userSettingsViewedByAdmin =
        email !== ''
          ? { ...state.userSettingsViewedByAdmin, ...userSettings }
          : defaultState.userSettingsViewedByAdmin;
      userSettings = email !== '' ? {} : userSettings;
      return {
        ...state,
        ...userSettings,
        userSettingsViewedByAdmin,
      };
    },
    [actionTypes.SETTINGS_GET_USER_DEVICES](state, { error, payload }) {
      const { devices = {} } = payload;
      if (error) {
        return state;
      }

      return {
        ...state,
        devices,
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
