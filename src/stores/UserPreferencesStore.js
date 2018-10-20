import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';
import urls from '../utils/urls';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

const SETTINGS = [
  { default: 'Theme', setting: 'theme' },
  { default: 'PreviewTheme', setting: 'previewTheme' },
  { default: 'TTSLanguage', setting: 'ttsLanguage' },
  { default: 'UserName', setting: 'userName' },
  { default: 'PrefLanguage', setting: 'prefLanguage' },
  { default: 'TimeZone', setting: 'timeZone' },
  { default: 'ThemeValues', setting: 'customThemeValue' },
  { default: 'checked', setting: 'checked' },
  { default: 'serverUrl', setting: 'serverUrl' },
  { default: 'CountryDialCode', setting: 'countryDialCode' },
  { default: 'PhoneNo', setting: 'phoneNo' },
  { default: 'CountryCode', setting: 'countryCode' },
  { default: 'BackgroundImage', setting: 'backgroundImage' },
  { default: 'EnterAsSend', setting: 'enterAsSend' },
  { default: 'MicInput', setting: 'micInput' },
  { default: 'SpeechOutput', setting: 'speechOutput' },
  { default: 'SpeechOutputAlways', setting: 'speechOutputAlways' },
  { default: 'SpeechPitch', setting: 'speechPitch' },
  { default: 'SpeechOutputAlways', setting: 'speechOutputAlways' },
];

let _defaults = {
  Theme: 'light',
  PreviewTheme: 'light',
  Server: urls.API_URL,
  StandardServer: urls.API_URL,
  EnterAsSend: true,
  MicInput: true,
  SpeechOutput: true,
  SpeechOutputAlways: false,
  SpeechRate: 1,
  SpeechPitch: 1,
  TTSLanguage: 'en-US',
  UserName: '',
  PrefLanguage: 'en-US',
  TimeZone: 'UTC-02',
  ThemeValues: '',
  LocalStorage: true,
  CountryCode: 'US',
  CountryDialCode: '+1',
  PhoneNo: '',
  checked: false,
  serverUrl: urls.API_URL,
  BackgroundImage: '',
};

function setDefaults(settings) {
  SETTINGS.forEach(element => {
    if (
      element.setting === 'enterAsSend' ||
      element.setting === 'micInput' ||
      element.setting === 'speechOutput'
    ) {
      if (settings.hasOwnProperty(element.setting)) {
        _defaults[element.default] = checkForFalse(settings[element.setting]);
      }
    } else if (element.setting === 'speechOutputAlways') {
      if (settings.hasOwnProperty(element.setting)) {
        _defaults[element.default] = checkForTrue(settings[element.setting]);
      }
    } else if (
      element.setting === 'speechRate' ||
      element.setting === 'speechPitch'
    ) {
      if (settings.hasOwnProperty(element.setting)) {
        let initSpeechProperty = parseFloat(settings[element.setting]);
        if (!isNaN(initSpeechProperty)) {
          _defaults[element.default] = initSpeechProperty;
        }
      }
    } else if (settings.hasOwnProperty(element.setting)) {
      _defaults[element.default] = settings[element.setting];
    }
  });

  if (settings.hasOwnProperty('checked')) {
    _defaults.checked = settings.checked;
  } else {
    _defaults.checked = false;
  }
  if (settings.hasOwnProperty('serverUrl')) {
    _defaults.serverUrl = settings.serverUrl;
  } else {
    _defaults.serverUrl = '';
  }
}

// Store handling all User Preferences
let UserPreferencesStore = {
  ...EventEmitter.prototype,

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  getPreferences() {
    return _defaults;
  },
  getTheme(preview = false) {
    return preview === false ? _defaults.Theme : _defaults.PreviewTheme;
  },
  getThemeValues() {
    return _defaults.ThemeValues;
  },

  getEnterAsSend() {
    return _defaults.EnterAsSend;
  },

  getMicInput() {
    return _defaults.MicInput;
  },

  getSpeechOutput() {
    return _defaults.SpeechOutput;
  },

  getSpeechOutputAlways() {
    return _defaults.SpeechOutputAlways;
  },

  getSpeechRate() {
    return _defaults.SpeechRate;
  },

  getSpeechPitch() {
    return _defaults.SpeechPitch;
  },

  getTTSLanguage() {
    return _defaults.TTSLanguage;
  },

  getUserName() {
    return _defaults.UserName;
  },

  getPrefLang() {
    return _defaults.PrefLanguage;
  },

  getPhoneNo() {
    return _defaults.PhoneNo;
  },

  getTimeZone() {
    return _defaults.TimeZone;
  },

  getBackgroundImage() {
    return _defaults.BackgroundImage;
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
};

function checkForFalse(valueToCheck) {
  if (valueToCheck === 'false' || !valueToCheck) {
    return false;
  }
  return true;
}

function checkForTrue(valueToCheck) {
  if (valueToCheck === 'true' || valueToCheck) {
    return true;
  }
  return false;
}

UserPreferencesStore.dispatchToken = ChatAppDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SERVER_CHANGED: {
      _defaults.Server = action.server;
      UserPreferencesStore.emitChange();
      break;
    }

    case ActionTypes.SETTINGS_CHANGED: {
      let settings = action.settings;
      setDefaults(settings);
      UserPreferencesStore.emitChange();
      break;
    }

    case ActionTypes.INIT_SETTINGS: {
      let settings = action.settings;

      if (settings.hasOwnProperty('LocalStorage')) {
        _defaults.Theme = settings.theme;
        _defaults.PreviewTheme = settings.previewTheme;
        _defaults.EnterAsSend = settings.enterAsSend;
        _defaults.MicInput = settings.micInput;
        _defaults.SpeechOutput = settings.speechOutput;
        _defaults.SpeechOutputAlways = settings.speechOutputAlways;
        _defaults.SpeechRate = settings.speechRate;
        _defaults.SpeechPitch = settings.speechPitch;
        _defaults.TTSLanguage = settings.ttsLanguage;
        _defaults.UserName = settings.userName;
        _defaults.PrefLanguage = settings.prefLanguage;
        _defaults.TimeZone = settings.timeZone;
        _defaults.ThemeValues = settings.customThemeValue;
        _defaults.checked = settings.checked;
        _defaults.serverUrl = settings.serverUrl;
        _defaults.PhoneNo = settings.phoneNo;
        _defaults.countryCode = settings.countryCode;
        _defaults.BackgroundImage = settings.backgroundImage;
      } else {
        setDefaults(settings);
      }
      UserPreferencesStore.emitChange();
      break;
    }
    default: {
      // do nothing
    }
  }
});

export default UserPreferencesStore;
