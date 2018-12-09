import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const defaultState = {
  theme: 'light',
  previewTheme: 'light',
  themeOpen: false,
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
    // Account
    [actionTypes.SETTINGS_SET_USER_NAME](state, { payload }) {
      const { userName } = payload;
      return {
        ...state,
        userName,
      };
    },
    [actionTypes.SETTINGS_SET_EMAILID](state, { payload }) {
      // identityName = emailId
      const { email } = payload;
      return {
        ...state,
        email,
      };
    },
    [actionTypes.SETTINGS_SET_TIMEZONE](state, { payload }) {
      const { timeZone } = payload;
      return {
        ...state,
        timeZone,
      };
    },
    [actionTypes.SETTINGS_SET_DEFAULT_LANGUAGE](state, { payload }) {
      const { prefLanguage } = payload;
      return {
        ...state,
        prefLanguage,
      };
    },
    // Mobile
    [actionTypes.SETTINGS_SET_PHONE_NUMBER](state, { payload }) {
      const { phoneNo } = payload;
      return {
        ...state,
        phoneNo,
      };
    },
    [actionTypes.SETTINGS_SET_COUNTRY_CODE](state, { payload }) {
      const { countryCode } = payload;
      return {
        ...state,
        countryCode,
      };
    },
    [actionTypes.SETTINGS_SET_COUNTRY_DIALCODE](state, { payload }) {
      const { countryDialCode } = payload;
      return {
        ...state,
        countryDialCode,
      };
    },
    // ChatApp
    [actionTypes.SETTINGS_TOGGLE_ENTER_AS_SEND](state, { payload }) {
      return {
        ...state,
        enterAsSend: !state.enterAsSend,
      };
    },
    // Theme
    [actionTypes.SETTINGS_SET_THEME](state, { payload }) {
      const { theme } = payload;
      return {
        ...state,
        theme,
      };
    },
    [actionTypes.SETTINGS_TOGGLE_CUSTOM_THEME](state, { payload }) {
      // themeOpen = open custom theme changer
      return {
        ...state,
        themeOpen: !state.themeOpen,
      };
    },
    // Microphone
    [actionTypes.SETTINGS_TOGGLE_MIC_INPUT](state, { payload }) {
      return {
        ...state,
        micInput: !state.micInput,
      };
    },
    // Speech
    [actionTypes.SETTINGS_TOGGLE_SPEECH_OUTPUT](state, { payload }) {
      return {
        ...state,
        speechOutput: !state.speechOutput,
      };
    },
    [actionTypes.SETTINGS_SET_OUTPUT_ALWAYS_ON](state, { payload }) {
      return {
        ...state,
        speechOutputAlways: !state.speechOutputAlways,
      };
    },
    [actionTypes.SETTINGS_SET_SPEECH_OUTPUT_RATE](state, { payload }) {
      const { speechRate } = payload;
      return {
        ...state,
        speechRate,
      };
    },
    [actionTypes.SETTINGS_SET_SPEECH_OUTPUT_PITCH](state, { payload }) {
      const { speechPitch } = payload;
      return {
        ...state,
        speechPitch,
      };
    },
    [actionTypes.SETTINGS_SET_SPEECH_OUTPUT_TTSLANGUAGE](state, { payload }) {
      const { ttsLanguage } = payload;
      return {
        ...state,
        ttsLanguage,
      };
    },
  },
  defaultState,
);
