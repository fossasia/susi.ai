import './Settings.css';
import $ from 'jquery';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import UserIdentityStore from '../../../stores/UserIdentityStore';
import MessageStore from '../../../stores/MessageStore';
import Cookies from 'universal-cookie';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import TextToSpeechSettings from './TextToSpeechSettings.react';
import Close from 'material-ui/svg-icons/navigation/close';
import ChangePassword from '../../Auth/ChangePassword/ChangePassword.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import RemoveDeviceDialog from '../../TableComplex/RemoveDeviceDialog.react';
import './Settings.css';
import Translate from '../../Translate/Translate.react';
import TextField from 'material-ui/TextField';
import StaticAppBar from '../../StaticAppBar/StaticAppBar.react';
import NotFound from '../../NotFound/NotFound.react';
import * as Actions from '../../../actions/';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import countryData from 'country-data';
import ShareOnSocialMedia from './ShareOnSocialMedia';
import TableComplex from '../../TableComplex/TableComplex.react';
import TimezonePicker from 'react-timezone';
import SwipeableViews from 'react-swipeable-views';
import { GoogleApiWrapper } from 'google-maps-react';
import MapContainer from '../../MapContainer/MapContainer.react';
import { MAP_KEY } from '../../../../src/config.js';
import ThemeChanger from './ThemeChanger';
// Icons
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import ThemeIcon from 'material-ui/svg-icons/action/invert-colors';
import VoiceIcon from 'material-ui/svg-icons/action/settings-voice';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import SpeechIcon from 'material-ui/svg-icons/action/record-voice-over';
import AccountIcon from 'material-ui/svg-icons/action/account-box';
import LockIcon from 'material-ui/svg-icons/action/lock';
import MyDevices from 'material-ui/svg-icons/device/devices';
import MobileIcon from 'material-ui/svg-icons/hardware/phone-android';
import ShareIcon from 'material-ui/svg-icons/social/share';
import { isProduction } from '../../../utils/helperFunctions';

const cookieDomain = isProduction() ? '.susi.ai' : '';

const cookies = new Cookies();

let defaults = UserPreferencesStore.getPreferences();
let defaultServerURL = defaults.Server;

let BASE_URL = '';
if (
  cookies.get('serverUrl') === defaultServerURL ||
  cookies.get('serverUrl') === null ||
  cookies.get('serverUrl') === undefined
) {
  BASE_URL = defaultServerURL;
} else {
  BASE_URL = cookies.get('serverUrl');
}

let url =
  BASE_URL +
  '/aaa/listUserSettings.json?' +
  'access_token=' +
  cookies.get('loggedIn');

class Settings extends Component {
  constructor(props) {
    super(props);
    defaults = UserPreferencesStore.getPreferences();
    let identity = UserIdentityStore.getIdentity();
    let defaultServer = defaults.Server;
    let defaultTheme = UserPreferencesStore.getTheme(this.preview);
    let defaultEnterAsSend = defaults.EnterAsSend;
    let defaultMicInput = defaults.MicInput;
    let defaultSpeechOutput = defaults.SpeechOutput;
    let defaultSpeechOutputAlways = defaults.SpeechOutputAlways;
    let defaultSpeechRate = defaults.SpeechRate;
    let defaultSpeechPitch = defaults.SpeechPitch;
    let defaultTTSLanguage = defaults.TTSLanguage;
    let defaultUserName = defaults.UserName;
    let defaultPrefLanguage = defaults.PrefLanguage;
    let defaultTimeZone = defaults.TimeZone;
    let defaultChecked = defaults.checked;
    let defaultServerUrl = defaults.serverUrl;
    let defaultCountryCode = defaults.CountryCode;
    let defaultCountryDialCode = defaults.CountryDialCode;
    let defaultPhoneNo = defaults.PhoneNo;
    let TTSBrowserSupport;
    if ('speechSynthesis' in window) {
      TTSBrowserSupport = true;
    } else {
      TTSBrowserSupport = false;
      console.warn(
        'The current browser does not support the SpeechSynthesis API.',
      );
    }
    let STTBrowserSupport;
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition;

    if (SpeechRecognition != null) {
      STTBrowserSupport = true;
    } else {
      STTBrowserSupport = false;
      console.warn(
        'The current browser does not support the SpeechRecognition API.',
      );
    }
    this.customServerMessage = '';
    this.TTSBrowserSupport = TTSBrowserSupport;
    this.STTBrowserSupport = STTBrowserSupport;
    this.state = {
      themeOpen: false,
      dataFetched: false,
      deviceData: false,
      obj: [],
      mapObj: [],
      devicenames: [],
      rooms: [],
      macids: [],
      editIdx: -1,
      removeDevice: -1,
      slideIndex: 0,
      centerLat: 0,
      centerLng: 0,
      identity,
      theme: defaultTheme,
      enterAsSend: defaultEnterAsSend,
      micInput: defaultMicInput,
      speechOutput: defaultSpeechOutput,
      speechOutputAlways: defaultSpeechOutputAlways,
      server: defaultServer,
      serverUrl: defaultServerUrl,
      serverFieldError: false,
      checked: defaultChecked,
      validForm: true,
      speechRate: defaultSpeechRate,
      speechPitch: defaultSpeechPitch,
      ttsLanguage: defaultTTSLanguage,
      UserName: defaultUserName,
      PrefLanguage: defaultPrefLanguage,
      TimeZone: defaultTimeZone,
      showServerChangeDialog: false,
      showChangePasswordDialog: false,
      showLogin: false,
      showSignUp: false,
      showForgotPassword: false,
      showOptions: false,
      showRemoveConfirmation: false,
      anchorEl: null,
      countryCode: defaultCountryCode,
      countryDialCode: defaultCountryDialCode,
      PhoneNo: defaultPhoneNo,
      voiceList: [
        {
          lang: 'am-AM',
          name: 'Armenian',
        },
        {
          lang: 'zh-CH',
          name: 'Chinese',
        },
        {
          lang: 'de-DE',
          name: 'Deutsch',
        },
        {
          lang: 'gr-GR',
          name: 'Greek',
        },
        {
          lang: 'hi-IN',
          name: 'Hindi',
        },
        {
          lang: 'pb-IN',
          name: 'Punjabi',
        },
        {
          lang: 'np-NP',
          name: 'Nepali',
        },
        {
          lang: 'ru-RU',
          name: 'Russian',
        },
        {
          lang: 'es-SP',
          name: 'Spanish',
        },
        {
          lang: 'fr-FR',
          name: 'French',
        },
        {
          lang: 'jp-JP',
          name: 'Japanese',
        },
        {
          lang: 'nl-NL',
          name: 'Dutch',
        },
        {
          lang: 'en-US',
          name: 'US English',
        },
      ],
      intialSettings: {
        theme: defaultTheme,
        enterAsSend: defaultEnterAsSend,
        micInput: defaultMicInput,
        speechOutput: defaultSpeechOutput,
        speechOutputAlways: defaultSpeechOutputAlways,
        speechRate: defaultSpeechRate,
        speechPitch: defaultSpeechPitch,
        ttsLanguage: defaultTTSLanguage,
        server: defaultServer,
        UserName: defaultUserName,
        PrefLanguage: defaultPrefLanguage,
        TimeZone: defaultTimeZone,
        serverUrl: defaultServerUrl,
        checked: defaultChecked,
        countryCode: defaultCountryCode,
        countryDialCode: defaultCountryDialCode,
        PhoneNo: defaultPhoneNo,
      },
    };
  }

  onRequestClose = () => {
    this.setState({ themeOpen: false });
  };

  onRequestOpen = () => {
    this.setState({ themeOpen: false });
  };

  handleRemove = i => {
    let data = this.state.obj;
    let macid = data[i].macid;

    this.setState({
      obj: data.filter((row, j) => j !== i),
    });

    $.ajax({
      url:
        BASE_URL +
        '/aaa/removeUserDevices.json?macid=' +
        macid +
        '&access_token=' +
        cookies.get('loggedIn'),
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 3000,
      async: false,
      success: function(response) {
        console.log(response);
      },
      error: function(errorThrown) {
        console.log(errorThrown);
      },
      complete: function(jqXHR, textStatus) {
        location.reload();
      },
    });
  };

  startEditing = i => {
    this.setState({ editIdx: i });
  };

  stopEditing = i => {
    let data = this.state.obj;
    let macid = data[i].macid;
    let devicename = data[i].devicename;
    let room = data[i].room;
    let latitude = data[i].latitude;
    let longitude = data[i].longitude;
    let devicenames = this.state.devicenames;
    devicenames[i] = devicename;
    let rooms = this.state.rooms;
    rooms[i] = room;
    this.setState({
      editIdx: -1,
      devicenames: devicenames,
      rooms: rooms,
    });

    $.ajax({
      url:
        BASE_URL +
        '/aaa/addNewDevice.json?macid=' +
        macid +
        '&name=' +
        devicename +
        '&room=' +
        room +
        '&latitude=' +
        latitude +
        '&longitude=' +
        longitude +
        '&access_token=' +
        cookies.get('loggedIn'),
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 3000,
      async: false,
      success: function(response) {
        console.log(response);
      },
      error: function(errorThrown) {
        console.log(errorThrown);
      },
    });
  };

  handleChange = (e, name, i) => {
    const value = e.target.value;
    let data = this.state.obj;
    this.setState({
      obj: data.map((row, j) => (j === i ? { ...row, [name]: value } : row)),
    });
  };

  handleTabSlide = value => {
    this.setState({
      slideIndex: value,
    });
  };

  apiCall = () => {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'jsonp',
      statusCode: {
        404: function(xhr) {
          if (window.console) {
            console.log(xhr.responseText);
          }
          console.log('Error 404: Resources not found!');
          document.location.reload();
        },
        503: function(xhr) {
          if (window.console) {
            console.log(xhr.responseText);
          }
          console.log('Error 503: Server not responding!');
          document.location.reload();
        },
      },
      crossDomain: true,
      timeout: 3000,
      async: false,
      success: function(response) {
        let obj = [];
        let mapObj = [];
        let devicenames = [];
        let rooms = [];
        let macids = [];
        let centerLat = 0;
        let centerLng = 0;
        if (response.devices) {
          let keys = Object.keys(response.devices);
          let devicesNotAvailable = 0;
          keys.forEach(i => {
            let myObj = {
              macid: i,
              devicename: response.devices[i].name,
              room: response.devices[i].room,
              latitude: response.devices[i].geolocation.latitude,
              longitude: response.devices[i].geolocation.longitude,
            };
            let locationData = {
              lat: parseFloat(response.devices[i].geolocation.latitude),
              lng: parseFloat(response.devices[i].geolocation.longitude),
            };
            if (
              myObj.latitude === 'Latitude not available.' ||
              myObj.longitude === 'Longitude not available.'
            ) {
              devicesNotAvailable++;
            } else {
              centerLat += parseFloat(response.devices[i].geolocation.latitude);
              centerLng += parseFloat(
                response.devices[i].geolocation.longitude,
              );
            }

            let location = {
              location: locationData,
            };
            obj.push(myObj);
            mapObj.push(location);
            devicenames.push(response.devices[i].name);
            rooms.push(response.devices[i].room);
            macids.push(i);
            this.setState({
              dataFetched: true,
            });
          });
          centerLat = centerLat / (mapObj.length - devicesNotAvailable);
          centerLng = centerLng / (mapObj.length - devicesNotAvailable);
          if (obj.length) {
            this.setState({
              deviceData: true,
              obj: obj,
            });
          }
          if (mapObj.length) {
            this.setState({
              mapObj: mapObj,
              centerLat: centerLat,
              centerLng: centerLng,
              devicesNotAvailable: devicesNotAvailable,
            });
          }
          if (devicenames.length) {
            this.setState({
              devicenames: devicenames,
            });
          }
          if (rooms.length) {
            this.setState({
              rooms: rooms,
            });
          }
          if (macids.length) {
            this.setState({
              macids: macids,
            });
          }
        }
      }.bind(this),
      error: function(errorThrown) {
        console.log(errorThrown);
      },
    });
  };

  // Boolean to store the state of preview i.e which theme to display
  preview = false;
  // save a variable in state holding the initial state of the settings
  setInitialSettings = () => {
    defaults = UserPreferencesStore.getPreferences();
    let identity = UserIdentityStore.getIdentity();
    let defaultServer = defaults.Server;
    let defaultTheme = UserPreferencesStore.getTheme(this.preview);
    let defaultEnterAsSend = defaults.EnterAsSend;
    let defaultMicInput = defaults.MicInput;
    let defaultSpeechOutput = defaults.SpeechOutput;
    let defaultSpeechOutputAlways = defaults.SpeechOutputAlways;
    let defaultSpeechRate = defaults.SpeechRate;
    let defaultSpeechPitch = defaults.SpeechPitch;
    let defaultTTSLanguage = defaults.TTSLanguage;
    let defaultUserName = defaults.UserName;
    let defaultPrefLanguage = defaults.PrefLanguage;
    let defaultTimeZone = defaults.TimeZone;
    let defaultChecked = defaults.checked;
    let defaultServerUrl = defaults.serverUrl;
    let defaultCountryCode = defaults.CountryCode;
    let defaultCountryDialCode = defaults.CountryDialCode;
    let defaultPhoneNo = defaults.PhoneNo;
    this.setState({
      identity,
      intialSettings: {
        theme: defaultTheme,
        enterAsSend: defaultEnterAsSend,
        micInput: defaultMicInput,
        speechOutput: defaultSpeechOutput,
        speechOutputAlways: defaultSpeechOutputAlways,
        speechRate: defaultSpeechRate,
        speechPitch: defaultSpeechPitch,
        ttsLanguage: defaultTTSLanguage,
        server: defaultServer,
        UserName: defaultUserName,
        PrefLanguage: defaultPrefLanguage,
        TimeZone: defaultTimeZone,
        serverUrl: defaultServerUrl,
        checked: defaultChecked,
        countryCode: defaultCountryCode,
        countryDialCode: defaultCountryDialCode,
        PhoneNo: defaultPhoneNo,
      },
    });
  };
  // extract values from store to get the initial settings
  setDefaultsSettings = () => {
    defaults = UserPreferencesStore.getPreferences();
    let defaultServer = defaults.Server;
    let defaultTheme = UserPreferencesStore.getTheme(this.preview);
    let defaultEnterAsSend = defaults.EnterAsSend;
    let defaultMicInput = defaults.MicInput;
    let defaultSpeechOutput = defaults.SpeechOutput;
    let defaultSpeechOutputAlways = defaults.SpeechOutputAlways;
    let defaultSpeechRate = defaults.SpeechRate;
    let defaultSpeechPitch = defaults.SpeechPitch;
    let defaultTTSLanguage = defaults.TTSLanguage;
    let defaultUserName = defaults.UserName;
    let defaultPrefLanguage = defaults.PrefLanguage;
    let defaultTimeZone = defaults.TimeZone;
    let defaultChecked = defaults.checked;
    let defaultServerUrl = defaults.serverUrl;
    let defaultCountryCode = defaults.CountryCode;
    let defaultCountryDialCode = defaults.CountryDialCode;
    let defaultPhoneNo = defaults.PhoneNo;
    this.setState({
      theme: defaultTheme,
      enterAsSend: defaultEnterAsSend,
      micInput: defaultMicInput,
      speechOutput: defaultSpeechOutput,
      speechOutputAlways: defaultSpeechOutputAlways,
      server: defaultServer,
      serverUrl: defaultServerUrl,
      serverFieldError: false,
      checked: defaultChecked,
      validForm: true,
      speechRate: defaultSpeechRate,
      speechPitch: defaultSpeechPitch,
      ttsLanguage: defaultTTSLanguage,
      UserName: defaultUserName,
      PrefLanguage: defaultPrefLanguage,
      TimeZone: defaultTimeZone,
      showServerChangeDialog: false,
      showChangePasswordDialog: false,
      showLogin: false,
      showSignUp: false,
      showForgotPassword: false,
      showOptions: false,
      showRemoveConfirmation: false,
      anchorEl: null,
      slideIndex: 0,
      countryCode: defaultCountryCode,
      countryDialCode: defaultCountryDialCode,
      PhoneNo: defaultPhoneNo,
    });
  };

  /**
   * Event handler for 'change' events coming from the UserPreferencesStore
   */
  _onChangeSettings() {
    this.setInitialSettings();
    this.setDefaultsSettings();
  }

  // Show change server dialog
  handleServer = () => {
    this.setState({
      showServerChangeDialog: true,
    });
  };

  // Show change password dialog
  handleChangePassword = () => {
    this.setState({
      showChangePasswordDialog: true,
    });
  };

  // Close all open dialogs
  handleClose = () => {
    this.setState({
      showServerChangeDialog: false,
      showChangePasswordDialog: false,
      showOptions: false,
      showLogin: false,
      showSignUp: false,
      showForgotPassword: false,
      showRemoveConfirmation: false,
    });
  };

  handleThemeChanger = () => {
    this.setState({ themeOpen: true });
    switch (this.state.currTheme) {
      case 'light': {
        this.applyLightTheme();
        break;
      }
      case 'dark': {
        this.applyDarkTheme();
        break;
      }
      default: {
        var prevThemeSettings = {};
        var state = this.state;
        prevThemeSettings.currTheme = state.currTheme;
        prevThemeSettings.bodyColor = state.body;
        prevThemeSettings.TopBarColor = state.header;
        prevThemeSettings.composerColor = state.composer;
        prevThemeSettings.messagePane = state.pane;
        prevThemeSettings.textArea = state.textarea;
        prevThemeSettings.buttonColor = state.button;
        prevThemeSettings.bodyBackgroundImage = state.bodyBackgroundImage;
        prevThemeSettings.messageBackgroundImage = state.messageBackgroundImage;
        this.setState({ prevThemeSettings });
      }
    }
  };

  applyLightTheme = () => {
    this.setState({
      prevThemeSettings: null,
      body: '#fff',
      header: '#4285f4',
      composer: '#f3f2f4',
      pane: '#f3f2f4',
      textarea: '#fff',
      button: '#4285f4',
      currTheme: 'light',
    });
    let customData = '';
    Object.keys(this.customTheme).forEach(key => {
      customData = customData + this.customTheme[key] + ',';
    });

    let settingsChanged = {};
    settingsChanged.theme = 'light';
    settingsChanged.customThemeValue = customData;
    if (this.state.bodyBackgroundImage || this.state.messageBackgroundImage) {
      settingsChanged.backgroundImage =
        this.state.bodyBackgroundImage +
        ',' +
        this.state.messageBackgroundImage;
    }
    Actions.settingsChanged(settingsChanged);
  };

  applyDarkTheme = () => {
    this.setState({
      prevThemeSettings: null,
      body: '#fff',
      header: '#4285f4',
      composer: '#f3f2f4',
      pane: '#f3f2f4',
      textarea: '#fff',
      button: '#4285f4',
      currTheme: 'dark',
    });
    let customData = '';
    Object.keys(this.customTheme).forEach(key => {
      customData = customData + this.customTheme[key] + ',';
    });

    let settingsChanged = {};
    settingsChanged.theme = 'dark';
    settingsChanged.customThemeValue = customData;
    if (this.state.bodyBackgroundImage || this.state.messageBackgroundImage) {
      settingsChanged.backgroundImage =
        this.state.bodyBackgroundImage +
        ',' +
        this.state.messageBackgroundImage;
    }
    Actions.settingsChanged(settingsChanged);
  };

  // Submit selected Settings
  handleSubmit = () => {
    let newDefaultServer = this.state.server;
    let newEnterAsSend = this.state.enterAsSend;
    let newMicInput = this.state.micInput;
    let newSpeechOutput = this.state.speechOutput;
    let newSpeechOutputAlways = this.state.speechOutputAlways;
    let newSpeechRate = this.state.speechRate;
    let newSpeechPitch = this.state.speechPitch;
    let newTTSLanguage = this.state.ttsLanguage;
    let newUserName = this.state.UserName;
    let newPrefLanguage = this.state.PrefLanguage;
    let newTimeZone = this.state.TimeZone;
    let checked = this.state.checked;
    let serverUrl = this.state.serverUrl;
    let newCountryCode = !this.state.countryCode
      ? this.intialSettings.countryCode
      : this.state.countryCode;
    let newCountryDialCode = !this.state.countryDialCode
      ? this.intialSettings.countryDialCode
      : this.state.countryDialCode;
    let newPhoneNo = this.state.PhoneNo;
    if (newDefaultServer.slice(-1) === '/') {
      newDefaultServer = newDefaultServer.slice(0, -1);
    }
    let vals = {
      server: newDefaultServer,
      enterAsSend: newEnterAsSend,
      micInput: newMicInput,
      speechOutput: newSpeechOutput,
      speechOutputAlways: newSpeechOutputAlways,
      speechRate: newSpeechRate,
      speechPitch: newSpeechPitch,
      ttsLanguage: newTTSLanguage,
      userName: newUserName,
      prefLanguage: newPrefLanguage,
      timeZone: newTimeZone,
      countryCode: newCountryCode,
      countryDialCode: newCountryDialCode,
      phoneNo: newPhoneNo,
      checked,
      serverUrl,
    };
    // if preview, save current theme state to previewTheme
    if (this.preview) {
      vals.theme = UserPreferencesStore.getTheme(!this.preview);
      vals.previewTheme = this.state.theme;
    }
    // else save current theme state to theme
    else {
      vals.theme = this.state.theme;
      vals.previewTheme = UserPreferencesStore.getTheme(this.preview);
    }
    let settings = Object.assign({}, vals);
    settings.LocalStorage = true;
    // Store in cookies for anonymous user
    cookies.set('settings', settings);
    console.log('settings saved', settings);
    this.setInitialSettings();
    // Trigger Actions to save the settings in stores and server
    this.implementSettings(vals);
    let userName = vals.userName;
    cookies.set('username', userName, {
      path: '/',
      domain: cookieDomain,
    });
  };

  // Store the settings in stores and server
  implementSettings = values => {
    let currSettings = UserPreferencesStore.getPreferences();
    let resetVoice = false;
    if (currSettings.SpeechOutput !== values.speechOutput) {
      resetVoice = true;
    }
    if (currSettings.SpeechOutputAlways !== values.speechOutputAlways) {
      resetVoice = true;
    }
    Actions.settingsChanged(values);
    if (resetVoice) {
      Actions.resetVoice();
    }
    this.props.history.push(`/settings?tab=${this.state.selectedSetting}`);
  };

  // Handle change to theme settings
  handleSelectChange = (event, value) => {
    value === 'light' || value === 'custom'
      ? (document.getElementById('settings-container').style.background =
          'rgb(242, 242, 242)')
      : (document.getElementById('settings-container').style.background =
          'rgb(0,0,18)');
    this.preview = true;
    this.setState({ theme: value }, () => {
      this.handleSubmit();
      this.preview = false;
    });
  };

  // Handle change to enter as send settings
  handleEnterAsSend = (event, isInputChecked) => {
    this.setState({
      enterAsSend: isInputChecked,
    });
  };

  // Handle change to mic input settings
  handleMicInput = (event, isInputChecked) => {
    this.setState({
      micInput: isInputChecked,
    });
  };

  // Handle change to speech output on speech input settings
  handleSpeechOutput = (event, isInputChecked) => {
    this.setState({
      speechOutput: isInputChecked,
    });
  };

  // Handle change to speech output always settings
  handleSpeechOutputAlways = (event, isInputChecked) => {
    this.setState({
      speechOutputAlways: isInputChecked,
    });
  };

  // save new TTS settings
  handleNewTextToSpeech = settings => {
    this.setState({
      speechRate: settings.speechRate,
      speechPitch: settings.speechPitch,
      ttsLanguage: settings.ttsLanguage,
    });
  };

  // Handle toggle between default server and custom server
  handleServeChange = event => {
    let state = this.state;
    let serverUrl;
    if (event.target.value === 'customServer') {
      state.checked = !state.checked;
      defaults = UserPreferencesStore.getPreferences();
      state.serverUrl = defaults.StandardServer;
      state.serverFieldError = false;
    } else if (event.target.name === 'serverUrl') {
      serverUrl = event.target.value;
      //eslint-disable-next-line
      let validServerUrl = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i.test(
        serverUrl,
      );
      state.serverUrl = serverUrl;
      state.serverFieldError = !(serverUrl && validServerUrl);
    }
    this.setState(state);

    if (this.state.serverFieldError) {
      this.customServerMessage = 'Enter a valid URL';
    } else {
      this.customServerMessage = '';
    }

    if (this.state.serverFieldError && this.state.checked) {
      this.setState({ validForm: false });
    } else {
      this.setState({ validForm: true });
    }
  };

  handleServerToggle = changeServer => {
    if (changeServer) {
      // Logout the user and show the login screen again
      this.props.history.push('/logout');
      this.setState({
        showLogin: true,
      });
    } else {
      // Go back to settings dialog
      this.setState({
        showServerChangeDialog: false,
      });
    }
  };

  // Close settings and redirect to landing page
  onRequestClose = () => {
    this.props.history.push('/');
    window.location.reload();
  };

  // Open Login dialog
  handleLogin = () => {
    this.setState({
      showLogin: true,
      showSignUp: false,
      showForgotPassword: false,
      showOptions: false,
      showRemoveConfirmation: false,
    });
  };

  // Open SignUp dialog
  handleSignUp = () => {
    this.setState({
      showSignUp: true,
      showLogin: false,
      showForgotPassword: false,
      showOptions: false,
      showRemoveConfirmation: false,
    });
  };

  // Open Forgot Password dialog
  handleForgotPassword = () => {
    this.setState({
      showForgotPassword: true,
      showLogin: false,
      showOptions: false,
      showRemoveConfirmation: false,
    });
  };

  // Open Remove Device Confirmation dialog
  handleRemoveConfirmation = i => {
    let data = this.state.obj;
    let devicename = data[i].devicename;
    this.setState({
      showRemoveConfirmation: true,
      showForgotPassword: false,
      showLogin: false,
      showOptions: false,
      removeDevice: i,
      removeDeviceName: devicename,
    });
  };

  // Show Top Bar drop down menu
  showOptions = event => {
    this.setState({
      showOptions: true,
      anchorEl: event.currentTarget,
    });
  };

  handlePrefLang = (event, index, value) => {
    this.setState({
      PrefLanguage: value,
    });
  };

  handleTimeZone = value => {
    this.setState({
      TimeZone: value,
    });
  };

  // Close Top Bar drop down menu
  closeOptions = () => {
    this.setState({
      showOptions: false,
    });
  };

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange.bind(this));
    UserPreferencesStore.removeChangeListener(
      this._onChangeSettings.bind(this),
    );
  }

  // Populate language list
  _onChange() {
    this.setState({
      voiceList: [
        {
          lang: 'de-DE',
          name: 'Deutsch',
        },
        {
          lang: 'am-AM',
          name: 'Armenian',
        },
        {
          lang: 'en-US',
          name: 'US English',
        },
        {
          lang: 'gr-GR',
          name: 'Greek',
        },
        {
          lang: 'hi-IN',
          name: 'Hindi',
        },
        {
          lang: 'fr-FR',
          name: 'French',
        },
        {
          lang: 'ru-RU',
          name: 'Russian',
        },
        {
          lang: 'jp-JP',
          name: 'Japanese',
        },
        {
          lang: 'nl-NL',
          name: 'Dutch',
        },
      ],
    });
  }

  // eslint-disable-next-line
  componentDidMount() {
    document.body.className = 'white-body';
    if (!this.state.dataFetched && cookies.get('loggedIn')) {
      this.apiCall();
    }
    document.title =
      'Settings - SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
    MessageStore.addChangeListener(this._onChange.bind(this));
    UserPreferencesStore.addChangeListener(this._onChangeSettings.bind(this));
    this.setState({
      search: false,
    });

    this.showWhenLoggedIn = 'none';
    let searchParams = new URLSearchParams(window.location.search);
    let tab = searchParams.get('tab');
    if (tab) {
      this.setState({
        selectedSetting: tab,
      });
    } else {
      this.setState({
        selectedSetting: cookies.get('loggedIn') ? 'Account' : 'ChatApp',
      });
    }
    this.showWhenLoggedIn = 'none';
  }

  // Generate language list drop down menu items
  populateVoiceList = () => {
    let voices = this.state.voiceList;
    let langCodes = [];
    let voiceMenu = voices.map((voice, index) => {
      langCodes.push(voice.lang);
      return (
        <MenuItem
          value={voice.lang}
          key={index}
          primaryText={voice.name + ' (' + voice.lang + ')'}
        />
      );
    });
    let currLang = this.state.PrefLanguage;
    let voiceOutput = {
      voiceMenu: voiceMenu,
      voiceLang: currLang,
    };
    // `-` and `_` replacement check of lang codes
    if (langCodes.indexOf(currLang) === -1) {
      if (
        currLang.indexOf('-') > -1 &&
        langCodes.indexOf(currLang.replace('-', '_')) > -1
      ) {
        voiceOutput.voiceLang = currLang.replace('-', '_');
      } else if (
        currLang.indexOf('_') > -1 &&
        langCodes.indexOf(currLang.replace('_', '-')) > -1
      ) {
        voiceOutput.voiceLang = currLang.replace('_', '-');
      }
    }
    return voiceOutput;
  };

  loadSettings = (e, value) => {
    this.setDefaultsSettings(); // on every tab change, load the default settings
    this.setState({
      selectedSetting: window.innerWidth > 1060 ? value : e.target.innerText,
      settingNo: e.target.innerText,
    });
    //  Revert to original theme if user navigates away without saving.
    if (this.state.theme !== UserPreferencesStore.getTheme()) {
      this.setState({ theme: UserPreferencesStore.getTheme() }, () => {
        this.handleSubmit();
      });
    }
  };

  displaySaveChangesButton = () => {
    let selectedSetting = this.state.selectedSetting;
    if (selectedSetting === 'Password') {
      return false;
    }
    if (selectedSetting === 'Devices') {
      return false;
    }
    if (selectedSetting === 'Share on Social media') {
      return false;
    }
    return true; // display the button otherwise
  };

  getSomethingToSave = () => {
    let somethingToSave = false;
    const intialSettings = this.state.intialSettings;
    const classState = this.state;
    if (UserPreferencesStore.getTheme() !== this.state.theme) {
      somethingToSave = true;
    } else if (intialSettings.enterAsSend !== classState.enterAsSend) {
      somethingToSave = true;
    } else if (intialSettings.micInput !== classState.micInput) {
      somethingToSave = true;
    } else if (intialSettings.speechOutput !== classState.speechOutput) {
      somethingToSave = true;
    } else if (
      intialSettings.speechOutputAlways !== classState.speechOutputAlways
    ) {
      somethingToSave = true;
    } else if (intialSettings.speechRate !== classState.speechRate) {
      somethingToSave = true;
    } else if (intialSettings.speechPitch !== classState.speechPitch) {
      somethingToSave = true;
    } else if (intialSettings.ttsLanguage !== classState.ttsLanguage) {
      somethingToSave = true;
    } else if (intialSettings.server !== classState.server) {
      somethingToSave = true;
    } else if (intialSettings.checked !== classState.checked) {
      somethingToSave = true;
    } else if (intialSettings.UserName !== classState.UserName) {
      somethingToSave = true;
    } else if (intialSettings.PrefLanguage !== classState.PrefLanguage) {
      somethingToSave = true;
    } else if (intialSettings.TimeZone !== classState.TimeZone) {
      somethingToSave = true;
    } else if (intialSettings.countryCode !== classState.countryCode) {
      somethingToSave = true;
    } else if (intialSettings.serverUrl !== classState.serverUrl) {
      somethingToSave = true;
    } else if (intialSettings.PhoneNo !== classState.PhoneNo) {
      somethingToSave = true;
    } else if (intialSettings.PrefLanguage !== classState.PrefLanguage) {
      somethingToSave = true;
    }
    return somethingToSave;
  };

  handleCountryChange = (event, index, value) => {
    this.setState({
      countryCode: value,
      countryDialCode:
        countryData.countries[value ? value : 'US'].countryCallingCodes[0],
    });
  };

  handleTelephoneNoChange = (event, value) => {
    const re = /^\d*$/;
    const verify = /^(?:[0-9] ?){6,14}[0-9]$/;
    if (value === '' || re.test(value)) {
      this.setState({ PhoneNo: value });
    }
    if (!verify.test(value)) {
      this.setState({ phoneNoError: 'Invalid phone number' });
    } else {
      this.setState({ phoneNoError: '' });
    }
  };

  handleUserName = (event, value) => {
    this.setState({ UserName: value });
  };

  render() {
    document.body.style.setProperty('background-image', 'none');

    const bodyStyle = {
      padding: 0,
      textAlign: 'center',
    };

    const themeBackgroundColor =
      this.state.intialSettings.theme === 'dark' ? '#19324c' : '#fff';
    const themeForegroundColor =
      this.state.intialSettings.theme === 'dark' ? '#fff' : '#272727';

    const floatingLabelStyle = {
      color: '#9e9e9e',
    };
    const underlineStyle = {
      color: this.state.intialSettings.theme === 'dark' ? '#9E9E9E' : null,
      borderColor:
        this.state.intialSettings.theme === 'dark' ? '#9E9E9E' : null,
    };
    const menuIconColor =
      this.state.intialSettings.theme === 'dark' ? themeForegroundColor : null;
    countryData.countries.all.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    let countries = countryData.countries.all.map((country, i) => {
      if (countryData.countries.all[i].countryCallingCodes[0]) {
        return (
          <MenuItem
            value={countryData.countries.all[i].alpha2}
            key={i}
            primaryText={
              countryData.countries.all[i].name +
              ' ' +
              countryData.countries.all[i].countryCallingCodes[0]
            }
          />
        );
      }
      return null;
    });
    const closingStyle = {
      position: 'absolute',
      zIndex: 1200,
      fill: '#444',
      width: '26px',
      height: '26px',
      right: '10px',
      top: '10px',
      cursor: 'pointer',
    };

    const serverDialogActions = [
      <RaisedButton
        key={'Cancel'}
        label={<Translate text="Cancel" />}
        backgroundColor={
          UserPreferencesStore.getTheme() === 'light' ? '#4285f4' : '#19314B'
        }
        labelColor="#fff"
        width="200px"
        keyboardFocused={false}
        onTouchTap={this.handleServerToggle.bind(this, false)}
        style={{ margin: '6px' }}
      />,
      <RaisedButton
        key={'OK'}
        label={<Translate text="OK" />}
        backgroundColor={
          UserPreferencesStore.getTheme() === 'light' ? '#4285f4' : '#19314B'
        }
        labelColor="#fff"
        width="200px"
        keyboardFocused={false}
        onTouchTap={this.handleServerToggle.bind(this, true)}
      />,
    ];

    const divStyle = {
      textAlign: 'left',
      padding: '20px',
      marginLeft: '10px',
    };

    const radioIconStyle = {
      fill: '#4285f4',
    };
    const inputStyle = {
      height: '35px',
      marginBottom: '10px',
    };
    const fieldStyle = {
      height: '35px',
      borderRadius: 4,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '0px 12px',
      width: 'auto',
    };

    let currentSetting;

    let voiceOutput = this.populateVoiceList();
    if (this.state.selectedSetting === 'Microphone') {
      currentSetting = '';
      currentSetting = (
        <div style={divStyle}>
          <div>
            <div>
              <div
                style={{
                  marginTop: '10px',
                  marginBottom: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                <Translate text="Mic Input" />
              </div>
              {UserPreferencesStore.getTheme() === 'light' ? (
                <hr className="break-line-light" style={{ height: '2px' }} />
              ) : (
                <hr className="break-line-dark" />
              )}
              <br />
              <div
                style={{
                  float: 'left',
                  padding: '0px 5px 0px 0px',
                }}
              >
                <Translate text="Enable mic to give voice input " />
              </div>
              <Toggle
                className="settings-toggle"
                labelStyle={{ color: themeForegroundColor }}
                disabled={!this.STTBrowserSupport}
                onToggle={this.handleMicInput}
                toggled={this.state.micInput}
              />
              <br />
            </div>
          </div>
        </div>
      );
    } else if (this.state.selectedSetting === 'Share on Social media') {
      currentSetting = '';
      currentSetting = (
        <div style={divStyle}>
          <ShareOnSocialMedia />
        </div>
      );
    } else if (this.state.selectedSetting === 'Theme') {
      currentSetting = '';
      currentSetting = (
        <div style={divStyle}>
          <span>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              <Translate text="Select Theme" />
            </div>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" style={{ height: '2px' }} />
            ) : (
              <hr className="break-line-dark" />
            )}
          </span>
          <RadioButtonGroup
            style={{ textAlign: 'left', margin: 20 }}
            onChange={this.handleSelectChange}
            name="Theme"
            valueSelected={this.state.theme}
          >
            <RadioButton
              style={{ width: '20%', display: 'block' }}
              iconStyle={radioIconStyle}
              labelStyle={{ color: themeForegroundColor }}
              value="light"
              label={<Translate text="Light" />}
            />
            <RadioButton
              style={{ width: '20%', display: 'block' }}
              iconStyle={radioIconStyle}
              labelStyle={{ color: themeForegroundColor }}
              value="dark"
              label={<Translate text="Dark" />}
            />
            <RadioButton
              style={{
                width: '20%',
                display: cookies.get('loggedIn') ? 'inline-block' : 'none',
              }}
              iconStyle={radioIconStyle}
              labelStyle={{ color: themeForegroundColor }}
              value="custom"
              label={<Translate text="Custom" />}
            />
          </RadioButtonGroup>
          <RaisedButton
            label={<Translate text="Edit theme" />}
            backgroundColor="#4285f4"
            labelColor="#fff"
            onClick={this.handleThemeChanger}
          />
          <ThemeChanger
            themeOpen={this.state.themeOpen}
            onRequestClose={() => this.onRequestClose}
          />
        </div>
      );
    } else if (this.state.selectedSetting === 'Speech') {
      currentSetting = (
        <div style={divStyle}>
          <div>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              <Translate text="Speech Output" />
            </div>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" style={{ height: '2px' }} />
            ) : (
              <hr className="break-line-dark" />
            )}
            <br />
            <div
              style={{
                float: 'left',
                padding: '0px 5px 0px 0px',
              }}
            >
              <Translate text="Enable speech output only for speech input" />
            </div>
            <Toggle
              className="settings-toggle"
              disabled={!this.TTSBrowserSupport}
              labelStyle={{ color: themeForegroundColor }}
              onToggle={this.handleSpeechOutput}
              toggled={this.state.speechOutput}
            />
            <br />
            <br />
          </div>
          <div>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '0px',
                fontSize: '15px',
                fontWeight: 'bold',
              }}
            >
              <Translate text="Speech Output Always ON" />
            </div>
            <br />
            <div
              style={{
                float: 'left',
                padding: '5px 5px 0px 0px',
              }}
            >
              <Translate text="Enable speech output regardless of input type" />
            </div>
            <Toggle
              className="settings-toggle"
              disabled={!this.TTSBrowserSupport}
              labelStyle={{ color: themeForegroundColor }}
              onToggle={this.handleSpeechOutputAlways}
              toggled={this.state.speechOutputAlways}
            />
            <br />
            <br />
          </div>
          <div>
            <TextToSpeechSettings
              rate={this.state.speechRate}
              pitch={this.state.speechPitch}
              lang={this.state.ttsLanguage}
              newTtsSettings={this.handleNewTextToSpeech.bind(this)}
            />
          </div>
        </div>
      );
    } else if (
      this.state.selectedSetting === 'Account' &&
      cookies.get('loggedIn')
    ) {
      currentSetting = (
        <div style={divStyle}>
          <span>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              <Translate text="Account" />
            </div>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" style={{ height: '2px' }} />
            ) : (
              <hr className="break-line-dark" />
            )}
          </span>

          <div
            style={{
              marginTop: '10px',
              marginBottom: '5px',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="User Name" />
          </div>
          <TextField
            name="username"
            style={fieldStyle}
            value={this.state.UserName}
            onChange={this.handleUserName}
            inputStyle={inputStyle}
            placeholder="Enter your User Name"
            underlineStyle={{ display: 'none' }}
          />
          <br />

          <div
            style={{
              marginTop: '10px',
              marginBottom: '5px',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="Email" />
          </div>
          <TextField
            name="email"
            style={fieldStyle}
            value={this.state.identity.name}
            inputStyle={inputStyle}
            underlineStyle={{ display: 'none' }}
          />
          <br />

          <div
            style={{
              marginTop: '10px',
              marginBottom: '0px',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="Select default language" />
          </div>
          <DropDownMenu
            value={voiceOutput.voiceLang}
            style={{ marginLeft: '-20px' }}
            disabled={!this.TTSBrowserSupport}
            labelStyle={{ color: themeForegroundColor }}
            menuStyle={{ backgroundColor: themeBackgroundColor }}
            menuItemStyle={{ color: themeForegroundColor }}
            onChange={this.handlePrefLang}
          >
            {voiceOutput.voiceMenu}
          </DropDownMenu>
          <br />
          <div
            style={{
              marginTop: '10px',
              marginBottom: '0px',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="Select TimeZone" />
          </div>
          <br />
          <TimezonePicker
            value={this.state.TimeZone}
            onChange={timezone => this.handleTimeZone(timezone)}
            inputProps={{
              placeholder: 'Select Timezone...',
              name: 'timezone',
            }}
          />
        </div>
      );
    } else if (
      this.state.selectedSetting === 'Password' &&
      cookies.get('loggedIn')
    ) {
      currentSetting = (
        <div style={divStyle}>
          <span>
            <span>
              <div
                style={{
                  marginTop: '10px',
                  marginBottom: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                <Translate text="Password" />
              </div>
            </span>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr
                className="break-line-light"
                style={{ height: '2px', marginBottom: '10px' }}
              />
            ) : (
              <hr
                className="break-line-dark"
                style={{ height: '2px', marginBottom: '10px' }}
              />
            )}
            <ChangePassword
              settings={this.state.intialSettings}
              {...this.props}
            />
          </span>
        </div>
      );
    } else if (this.state.selectedSetting === 'Devices') {
      currentSetting = (
        <span style={{ right: '40px' }}>
          <div style={divStyle}>
            <span>
              <div
                style={{
                  marginTop: '10px',
                  marginBottom: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                <Translate text="Devices" />
              </div>
            </span>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr
                className="break-line-light"
                style={{ height: '2px', marginBottom: '10px' }}
              />
            ) : (
              <hr
                className="break-line-dark"
                style={{ height: '2px', marginBottom: '10px' }}
              />
            )}
            {this.state.deviceData ? (
              <div>
                <SwipeableViews>
                  <div>
                    <div style={{ overflowX: 'auto' }}>
                      <div
                        className="table"
                        style={{
                          left: '0px',
                          marginTop: '0px',
                          width: '550px',
                        }}
                      >
                        <TableComplex
                          handleRemove={this.handleRemove}
                          handleRemoveConfirmation={
                            this.handleRemoveConfirmation
                          }
                          startEditing={this.startEditing}
                          editIdx={this.state.editIdx}
                          stopEditing={this.stopEditing}
                          handleChange={this.handleChange}
                          tableData={this.state.obj}
                        />
                      </div>
                      <div>
                        <div style={{ maxHeight: '300px', marginTop: '10px' }}>
                          <MapContainer
                            google={this.props.google}
                            mapData={this.state.mapObj}
                            centerLat={this.state.centerLat}
                            centerLng={this.state.centerLng}
                            devicenames={this.state.devicenames}
                            rooms={this.state.rooms}
                            macids={this.state.macids}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwipeableViews>
                {this.state.slideIndex && this.state.devicesNotAvailable ? (
                  <div style={{ marginTop: '10px' }}>
                    <b>NOTE: </b>Location info of one or more devices could not
                    be retrieved.
                  </div>
                ) : null}
              </div>
            ) : (
              <div id="subheading">
                You do not have any devices connected yet!
              </div>
            )}
          </div>
        </span>
      );
    } else if (
      this.state.selectedSetting === 'Mobile' &&
      cookies.get('loggedIn')
    ) {
      currentSetting = (
        <span style={divStyle}>
          <div>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '5px',
                marginLeft: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              <Translate text="Mobile" />
            </div>
            <div
              style={{
                marginTop: '0px',
                marginBottom: '0px',
                marginLeft: '30px',
                fontSize: '14px',
              }}
            >
              <Translate text="Expand your experience, get closer, and stay current" />
            </div>
            <hr color="#f8f8f8" />
            <div
              style={{
                marginTop: '0px',
                marginBottom: '0px',
                marginLeft: '30px',
                fontSize: '15px',
                fontWeight: 'bold',
              }}
            >
              <Translate text="Add your phone number" />
            </div>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '0px',
                marginLeft: '30px',
                fontSize: '14px',
              }}
            >
              <Translate text="In future, we will text a verification code to your number. Standard SMS fees may apply." />
            </div>
            <div
              style={{
                marginTop: '10px',
                marginBottom: '0px',
                marginLeft: '30px',
                fontSize: '14px',
              }}
            >
              <Translate text="Country/region : " />
              <DropDownMenu
                maxHeight={300}
                style={{ width: '250px', position: 'relative', top: '15px' }}
                labelStyle={{ color: themeForegroundColor }}
                menuStyle={{ backgroundColor: themeBackgroundColor }}
                menuItemStyle={{ color: themeForegroundColor }}
                value={this.state.countryCode ? this.state.countryCode : 'US'}
                onChange={this.handleCountryChange}
              >
                {countries}
              </DropDownMenu>
            </div>
            <div
              style={{
                marginTop: '20px',
                marginBottom: '0px',
                marginLeft: '30px',
                fontSize: '14px',
              }}
            >
              <Translate text="Phone number : " />
              <TextField
                name="selectedCountry"
                disabled={true}
                underlineDisabledStyle={
                  UserPreferencesStore.getTheme() === 'dark'
                    ? underlineStyle
                    : null
                }
                inputStyle={{
                  color:
                    UserPreferencesStore.getTheme() === 'dark'
                      ? '#fff'
                      : '#333',
                }}
                floatingLabelStyle={floatingLabelStyle}
                value={
                  countryData.countries[
                    this.state.countryCode ? this.state.countryCode : 'US'
                  ].countryCallingCodes[0]
                }
                style={{ width: '45px', marginLeft: '30px' }}
              />
            </div>
            <TextField
              name="phonenumber"
              style={{
                width: '150px',
                marginRight: '230px',
                float: 'right',
                marginTop: '-72px',
              }}
              onChange={this.handleTelephoneNoChange}
              inputStyle={{
                color:
                  UserPreferencesStore.getTheme() === 'dark' ? '#fff' : '#333',
              }}
              floatingLabelStyle={floatingLabelStyle}
              value={this.state.PhoneNo}
              errorText={this.state.phoneNoError}
              floatingLabelText={<Translate text="Phone number" />}
            />
          </div>
        </span>
      );
    } else {
      currentSetting = (
        <div style={divStyle}>
          <div
            style={{
              marginTop: '10px',
              marginBottom: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="Preferences" />
          </div>
          {UserPreferencesStore.getTheme() === 'light' ? (
            <hr className="break-line-light" style={{ height: '2px' }} />
          ) : (
            <hr className="break-line-dark" />
          )}
          <br />
          <div
            style={{
              float: 'left',
              padding: '0px 5px 0px 0px',
            }}
          >
            <Translate text="Send message by pressing ENTER" />
          </div>
          <Toggle
            className="settings-toggle"
            onToggle={this.handleEnterAsSend}
            labelStyle={{ color: themeForegroundColor }}
            toggled={this.state.enterAsSend}
          />
          <br />
        </div>
      );
    }

    let blueThemeColor = { color: 'rgb(66, 133, 244)' };
    let menuItems = cookies.get('loggedIn') ? (
      <div>
        <div className="settings-list">
          <Menu
            selectedMenuItemStyle={blueThemeColor}
            style={{ width: '100%' }}
            onChange={this.loadSettings}
            value={this.state.selectedSetting}
          >
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Account"
              className="setting-item"
              leftIcon={<AccountIcon color={menuIconColor} />}
            >
              Account<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Password"
              className="setting-item"
              leftIcon={<LockIcon color={menuIconColor} />}
            >
              Password<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Mobile"
              className="setting-item"
              leftIcon={<MobileIcon color={menuIconColor} />}
            >
              Mobile<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="ChatApp"
              className="setting-item"
              leftIcon={<ChatIcon color={menuIconColor} />}
            >
              ChatApp<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Theme"
              className="setting-item"
              leftIcon={<ThemeIcon color={menuIconColor} />}
            >
              Theme<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Microphone"
              className="setting-item"
              leftIcon={<VoiceIcon color={menuIconColor} />}
            >
              Microphone<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Speech"
              className="setting-item"
              leftIcon={<SpeechIcon color={menuIconColor} />}
            >
              Speech<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem style={{ display: 'none' }} value="Account" />
            <MenuItem style={{ display: 'none' }} value="Mobile" />
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Devices"
              className="setting-item"
              leftIcon={<MyDevices color={menuIconColor} />}
            >
              Devices<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Share on Social media"
              className="setting-item"
              leftIcon={<ShareIcon color={menuIconColor} />}
            >
              Share on Social media<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
          </Menu>
        </div>
        <div className="settings-list-dropdown">
          <DropDownMenu
            selectedMenuItemStyle={blueThemeColor}
            onChange={this.loadSettings}
            value={this.state.selectedSetting}
            labelStyle={{ color: themeForegroundColor }}
            menuStyle={{ backgroundColor: themeBackgroundColor }}
            menuItemStyle={{ color: themeForegroundColor }}
            style={{ width: '100%' }}
            autoWidth={false}
          >
            <MenuItem
              primaryText="Account"
              value="Account"
              className="setting-item"
            />
            <MenuItem
              primaryText="Password"
              value="Password"
              className="setting-item"
            />
            <MenuItem
              primaryText="ChatApp"
              value="ChatApp"
              className="setting-item"
            />
            <MenuItem
              primaryText="Theme"
              value="Theme"
              className="setting-item"
            />
            <MenuItem
              primaryText="Microphone"
              value="Microphone"
              className="setting-item"
            />
            <MenuItem
              primaryText="Speech"
              value="Speech"
              className="setting-item"
            />
            <MenuItem
              primaryText="Devices"
              value="Devices"
              className="setting-item"
            />
            <MenuItem
              primaryText="Mobile"
              value="Mobile"
              className="setting-item"
            />
            <MenuItem
              primaryText="Share on Social media"
              value="Share on Social media"
              className="setting-item"
            />
          </DropDownMenu>
        </div>
      </div>
    ) : (
      <div>
        <div className="settings-list">
          <Menu
            selectedMenuItemStyle={blueThemeColor}
            style={{ width: '100%', height: '100%' }}
            onChange={this.loadSettings}
            value={this.state.selectedSetting}
          >
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="ChatApp"
              className="setting-item"
              leftIcon={<ChatIcon color={menuIconColor} />}
            >
              ChatApp<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Theme"
              className="setting-item"
              leftIcon={<ThemeIcon color={menuIconColor} />}
            >
              Theme<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Microphone"
              className="setting-item"
              leftIcon={<VoiceIcon color={menuIconColor} />}
            >
              Microphone<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Speech"
              className="setting-item"
              leftIcon={<SpeechIcon color={menuIconColor} />}
            >
              Speech<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
            <MenuItem
              style={{ color: themeForegroundColor }}
              value="Share on Social media"
              className="setting-item"
              leftIcon={<ShareIcon color={menuIconColor} />}
            >
              Share on Social media<ChevronRight
                style={{ color: themeForegroundColor }}
                className="right-chevron"
              />
            </MenuItem>
            {UserPreferencesStore.getTheme() === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
          </Menu>
        </div>
        <div className="settings-list-dropdown">
          <DropDownMenu
            selectedMenuItemStyle={blueThemeColor}
            onChange={this.loadSettings}
            value={this.state.selectedSetting}
            style={{ width: '100%' }}
            labelStyle={{ color: themeForegroundColor }}
            menuStyle={{ backgroundColor: themeBackgroundColor }}
            menuItemStyle={{ color: themeForegroundColor }}
            autoWidth={false}
          >
            <MenuItem
              primaryText="ChatApp"
              value="ChatApp"
              className="setting-item"
            />
            <MenuItem
              primaryText="Theme"
              value="Theme"
              className="setting-item"
            />
            <MenuItem
              primaryText="Microphone"
              value="Microphone"
              className="setting-item"
            />
            <MenuItem
              primaryText="Speech"
              value="Speech"
              className="setting-item"
            />
            <MenuItem
              primaryText="Share on Social media"
              value="Share on Social media"
              className="setting-item"
            />
          </DropDownMenu>
        </div>
      </div>
    );

    let menuStyle = {
      marginTop: 20,
      textAlign: 'center',
      display: 'inline-block',
      backgroundColor: themeBackgroundColor,
      color: themeForegroundColor,
    };

    // to check if something has been modified or not
    let somethingToSave = this.getSomethingToSave();

    if (!cookies.get('loggedIn')) {
      return <NotFound />;
    }

    return (
      <div
        id="settings-container"
        className={
          UserPreferencesStore.getTheme() === 'light'
            ? 'settings-container-light'
            : 'settings-container-dark'
        }
      >
        <Dialog
          className="dialogStyle"
          modal={false}
          open={this.state.showRemoveConfirmation}
          autoScrollBodyContent={true}
          contentStyle={{ width: '35%', minWidth: '300px' }}
          onRequestClose={this.handleClose}
        >
          <RemoveDeviceDialog
            {...this.props}
            deviceIndex={this.state.removeDevice}
            devicename={this.state.removeDeviceName}
            handleRemove={this.handleRemove}
          />
          <Close style={closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
        <StaticAppBar
          settings={this.state.intialSettings}
          {...this.props}
          location={this.props.location}
        />
        <div className="settingMenu">
          <Paper
            className="leftMenu tabStyle"
            zDepth={1}
            style={{
              backgroundColor: themeBackgroundColor,
              color: themeForegroundColor,
            }}
          >
            {menuItems}
          </Paper>
          <Paper className="rightMenu" style={menuStyle} zDepth={1}>
            {currentSetting}
            <div className="settingsSubmit">
              {this.displaySaveChangesButton() && (
                <RaisedButton
                  label={<Translate text="Save Changes" />}
                  disabled={
                    !this.state.validForm ||
                    !somethingToSave ||
                    this.state.phoneNoError
                  }
                  backgroundColor="#4285f4"
                  labelColor="#fff"
                  onClick={this.handleSubmit}
                />
              )}
              {this.state.selectedSetting !== 'Account' ? (
                ''
              ) : (
                <div style={{ marginRight: '20px' }}>
                  {UserPreferencesStore.getTheme() === 'light' ? (
                    <hr
                      className="break-line-light"
                      style={{ height: '2px', marginTop: '25px' }}
                    />
                  ) : (
                    <hr
                      className="break-line-dark"
                      style={{ height: '2px', marginTop: '25px' }}
                    />
                  )}

                  <p
                    style={{
                      textAlign: 'center',
                      marginTop: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="Link">
                      <a href="https://accounts.susi.ai/delete-account">
                        Deactivate your account
                      </a>
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Paper>
        </div>
        {/* Change Server */}
        <Dialog
          actions={serverDialogActions}
          modal={false}
          open={this.state.showServerChangeDialog}
          autoScrollBodyContent={true}
          bodyStyle={bodyStyle}
          onRequestClose={this.handleServerToggle.bind(this, false)}
        >
          <div>
            <h3>
              <Translate text="Change Server" />
            </h3>
            <Translate text="Please login again to change SUSI server" />
            <Close
              style={closingStyle}
              onTouchTap={this.handleServerToggle.bind(this, false)}
            />
          </div>
        </Dialog>
        {/* ForgotPassword */}
        <Dialog
          className="dialogStyle"
          modal={false}
          open={this.state.showForgotPassword}
          autoScrollBodyContent={true}
          contentStyle={{ width: '35%', minWidth: '300px' }}
          onRequestClose={this.handleClose}
        >
          <ForgotPassword
            {...this.props}
            showForgotPassword={this.handleForgotPassword}
          />
          <Close style={closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
      </div>
    );
  }
}

Settings.propTypes = {
  history: PropTypes.object,
  onSettingsSubmit: PropTypes.func,
  onServerChange: PropTypes.func,
  location: PropTypes.object,
  google: PropTypes.object,
  handleThemeChanger: PropTypes.func,
};

export default GoogleApiWrapper({
  apiKey: MAP_KEY,
})(Settings);
