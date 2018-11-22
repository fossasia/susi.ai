import './Settings.css';
import $ from 'jquery';
import { withRouter } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import UserIdentityStore from '../../../stores/UserIdentityStore';
import MessageStore from '../../../stores/MessageStore';
import Cookies from 'universal-cookie';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import RemoveDeviceDialog from '../../TableComplex/RemoveDeviceDialog.react';
import Translate from '../../Translate/Translate.react';
import StaticAppBar from '../../StaticAppBar/StaticAppBar.react';
import NotFound from '../../NotFound/NotFound.react';
import * as Actions from '../../../actions/';
import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import countryData from 'country-data';
import ShareOnSocialMedia from './ShareOnSocialMedia';
import { GoogleApiWrapper } from 'google-maps-react';
import {
  voiceList,
  voiceListChange,
} from './../../../constants/SettingsVoiceConstants.js';
import { MAP_KEY } from '../../../../src/config.js';
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
import {
  isProduction,
  sortCountryLexographical,
} from '../../../utils/helperFunctions';
import urls from '../../../utils/urls';

import MicrophoneTab from './MicrophoneTab.react';
import ThemeChangeTab from './ThemeChangeTab.react';
import SpeechTab from './SpeechTab.react';
import AccountTab from './AccountTab.react';
import PasswordTab from './PasswordTab.react';
import DevicesTab from './DevicesTab.react';
import MobileTab from './MobileTab.react';
import ChatAppTab from './ChatAppTab.react';

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

const divStyle = {
  textAlign: 'left',
  padding: '20px',
  marginLeft: '10px',
};

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
    this.customServerMessage = '';
    this.TTSBrowserSupport = TTSBrowserSupport;
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
      voiceList: voiceList,
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

  onThemeRequestClose = () => {
    this.setState({ themeOpen: false });
  };

  // handleRemove() function handles deletion of devices
  handleRemove = i => {
    let data = this.state.obj;
    let macid = data[i].macid;

    // Remove the row whose index does not matches the index passed in parameter
    this.setState({
      obj: data.filter((row, j) => j !== i),
    });

    // Make API call to the endpoint to delete the device on the server side
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

  // startEditing() function handles editing of rows
  // editIdx is set to the row index which is currently being edited
  startEditing = i => {
    this.setState({ editIdx: i });
  };

  // stopEditing() function handles saving of the changed device config
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

    // Set the value of editIdx to -1 to denote that no row is currently being edited
    // Set values for devicenames and rooms to pass as props for the Map View component
    this.setState({
      editIdx: -1,
      devicenames: devicenames,
      rooms: rooms,
    });

    // Make API call to the endpoint for adding new devices
    // to overwrite the updated config of devices on the existing config on the server
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

  // handleChange() function handles changing of textfield values on keypresses
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

  // apiCall() function fetches user settings and devices from the server
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

          // Extract device info and store them in an object, namely myObj
          keys.forEach(i => {
            let myObj = {
              macid: i,
              devicename: response.devices[i].name,
              room: response.devices[i].room,
              latitude: response.devices[i].geolocation.latitude,
              longitude: response.devices[i].geolocation.longitude,
            };

            // Store location info of the device for the Map View
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

          // Find average latitude and longitude to be used as initial center of map
          centerLat /= mapObj.length - devicesNotAvailable;
          centerLng /= mapObj.length - devicesNotAvailable;
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
  _onChangeSettings = () => {
    this.setInitialSettings();
    this.setDefaultsSettings();
  };

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
        let prevThemeSettings = {};
        let state = this.state;
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
      ? this.state.intialSettings.countryCode
      : this.state.countryCode;
    let newCountryDialCode = !this.state.countryDialCode
      ? this.state.intialSettings.countryDialCode
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
      ? $('#settings-container').addClass('settings-container-light')
      : $('#settings-container').addClass('settings-container-dark');
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
    MessageStore.removeChangeListener(this._onChange);
    UserPreferencesStore.removeChangeListener(this._onChangeSettings);
  }

  // Populate language list
  _onChange = () => {
    this.setState({
      voiceList: voiceListChange,
    });
  };

  // eslint-disable-next-line
  componentDidMount() {
    document.body.className = 'white-body';
    if (!this.state.dataFetched && cookies.get('loggedIn')) {
      this.apiCall();
    }
    document.title =
      'Settings - SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
    MessageStore.addChangeListener(this._onChange);
    UserPreferencesStore.addChangeListener(this._onChangeSettings);
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
    sortCountryLexographical(countryData);
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
        onTouchTap={() => this.handleServerToggle(false)}
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
        onTouchTap={() => this.handleServerToggle(true)}
      />,
    ];

    const radioIconStyle = {
      fill: '#4285f4',
    };
    const inputStyle = {
      height: '35px',
      marginBottom: '10px',
      color: UserPreferencesStore.getTheme() === 'dark' ? 'white' : 'black',
    };
    const fieldStyle = {
      height: '35px',
      borderRadius: 4,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '0px 12px',
      width: 'auto',
    };

    let currentSetting = '';

    let voiceOutput = this.populateVoiceList();
    if (this.state.selectedSetting === 'Microphone') {
      currentSetting = (
        <MicrophoneTab
          containerStyle={divStyle}
          themeForegroundColor={themeForegroundColor}
          themeVal={UserPreferencesStore.getTheme()}
          handleMicInput={this.handleChange}
          micInput={this.state.micInput}
        />
      );
    } else if (this.state.selectedSetting === 'Share on Social media') {
      currentSetting = <ShareOnSocialMedia containerStyle={divStyle} />;
    } else if (this.state.selectedSetting === 'Theme') {
      currentSetting = (
        <ThemeChangeTab
          containerStyle={divStyle}
          themeForegroundColor={themeForegroundColor}
          radioIconStyle={radioIconStyle}
          themeVal={UserPreferencesStore.getTheme()}
          theme={this.state.theme}
          handleSelectChange={this.handleSelectChange}
          isLoggedIn={cookies.get('loggedIn')}
          onThemeRequestClose={this.onRequestClose}
          handleThemeChanger={this.handleThemeChanger}
          themeOpen={this.state.themeOpen}
        />
      );
    } else if (this.state.selectedSetting === 'Speech') {
      currentSetting = (
        <SpeechTab
          containerStyle={divStyle}
          themeForegroundColor={themeForegroundColor}
          themeVal={UserPreferencesStore.getTheme()}
          handleSpeechOutputAlways={this.handleSpeechOutputAlways}
          speechOutputAlways={this.state.speechOutputAlways}
          speechRate={this.state.speechRate}
          speechPitch={this.state.speechPitch}
          ttsLanguage={this.state.ttsLanguage}
          handleNewTextToSpeech={this.handleNewTextToSpeech}
          handleSpeechOutput={this.handleSpeechOutput}
          speechOutput={this.state.speechOutput}
        />
      );
    } else if (
      this.state.selectedSetting === 'Account' &&
      cookies.get('loggedIn')
    ) {
      currentSetting = (
        <AccountTab
          containerStyle={divStyle}
          themeForegroundColor={themeForegroundColor}
          fieldStyle={fieldStyle}
          inputStyle={inputStyle}
          themeBackgroundColor={themeBackgroundColor}
          themeVal={UserPreferencesStore.getTheme()}
          userName={this.state.UserName}
          handleUserName={this.handleUserName}
          identityName={this.state.identity.name}
          timeZone={this.state.TimeZone}
          handlePrefLang={this.handlePrefLang}
          handleTimeZone={this.handleTimeZone}
          voiceOutput={voiceOutput}
        />
      );
    } else if (
      this.state.selectedSetting === 'Password' &&
      cookies.get('loggedIn')
    ) {
      currentSetting = (
        <PasswordTab
          containerStyle={divStyle}
          intialSettings={this.state.intialSettings}
          themeVal={UserPreferencesStore.getTheme()}
          {...this.props}
        />
      );
    } else if (this.state.selectedSetting === 'Devices') {
      currentSetting = (
        <DevicesTab
          containerStyle={divStyle}
          themeVal={UserPreferencesStore.getTheme()}
          deviceData={this.state.deviceData}
          handleRemove={this.handleRemove}
          handleRemoveConfirmation={this.handleRemoveConfirmation}
          startEditing={this.startEditing}
          editIdx={this.state.editIdx}
          stopEditing={this.stopEditing}
          handleChange={this.handleChange}
          tableData={this.state.obj}
          mapObj={this.state.mapObj}
          google={this.props.google}
          centerLat={this.state.centerLat}
          centerLng={this.state.centerLng}
          deviceNames={this.state.devicenames}
          rooms={this.state.rooms}
          macIds={this.state.macids}
          slideIndex={this.state.slideIndex}
          devicesNotAvailable={this.state.devicesNotAvailable}
        />
      );
    } else if (
      this.state.selectedSetting === 'Mobile' &&
      cookies.get('loggedIn')
    ) {
      currentSetting = (
        <MobileTab
          containerStyle={divStyle}
          floatingLabelStyle={floatingLabelStyle}
          themeBackgroundColor={themeBackgroundColor}
          themeForegroundColor={themeForegroundColor}
          underlineStyle={underlineStyle}
          themeVal={UserPreferencesStore.getTheme()}
          phoneNo={this.state.PhoneNo}
          phoneNoError={this.state.phoneNoError}
          countryCode={this.state.countryCode}
          countries={countries}
          countryData={countryData.countries}
          handleCountryChange={this.handleCountryChange}
          handleTelephoneNoChange={this.handleTelephoneNoChange}
        />
      );
    } else {
      currentSetting = (
        <ChatAppTab
          containerStyle={divStyle}
          themeVal={UserPreferencesStore.getTheme()}
          themeForegroundColor={themeForegroundColor}
          enterAsSend={this.state.enterAsSend}
          handleEnterAsSend={this.handleEnterAsSend}
        />
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
          (UserPreferencesStore.getTheme() === 'light' &&
            this.state.settingNo !== 'Theme') ||
          (this.state.settingNo === 'Theme' && this.state.theme === 'light')
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
                      <a href={`${urls.ACCOUNT_URL}/delete-account`}>
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
          onRequestClose={() => this.handleServerToggle(false)}
        >
          <div>
            <h3>
              <Translate text="Change Server" />
            </h3>
            <Translate text="Please login again to change SUSI server" />
            <Close
              style={closingStyle}
              onTouchTap={() => this.handleServerToggle(false)}
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

export default withRouter(
  GoogleApiWrapper({
    apiKey: MAP_KEY,
  })(Settings),
);
