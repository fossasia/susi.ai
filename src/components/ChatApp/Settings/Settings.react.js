import './Settings.css';
import $ from 'jquery';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';
import RemoveDeviceDialog from '../../TableComplex/RemoveDeviceDialog.react';
import Translate from '../../Translate/Translate.react';
import StaticAppBar from '../../StaticAppBar/StaticAppBar.react';
import * as Actions from '../../../actions/';
import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import countryData from 'country-data';
import ShareOnSocialMedia from './ShareOnSocialMedia';
import { voiceList } from './../../../constants/SettingsVoiceConstants.js';
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
import { sortCountryLexographical } from '../../../utils/helperFunctions';
import urls from '../../../utils/urls';
import { isPhoneNumber } from '../../../utils';

import MicrophoneTab from './MicrophoneTab.react';
import ThemeChangeTab from './ThemeChangeTab.react';
import SpeechTab from './SpeechTab.react';
import AccountTab from './AccountTab.react';
import PasswordTab from './PasswordTab.react';
import DevicesTab from './DevicesTab.react';
import MobileTab from './MobileTab.react';
import ChatAppTab from './ChatAppTab.react';
import { bindActionCreators } from 'redux';
import settingsActions from '../../../redux/actions/settings';

const cookies = new Cookies();

const styles = {
  divStyle: {
    textAlign: 'left',
    padding: '20px',
    marginLeft: '10px',
  },
  closingStyle: {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  },

  radioIconStyle: {
    fill: '#4285f4',
  },
  inputStyle: {
    height: '35px',
    marginBottom: '10px',
  },
  fieldStyle: {
    height: '35px',
    borderRadius: 4,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '0px 12px',
    width: 'auto',
  },
  tabHeadingStyle: {
    marginTop: '10px',
    marginBottom: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  headingStyle: {
    marginTop: '10px',
    marginBottom: '5px',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  menuStyle: {
    marginTop: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
};

class Settings extends Component {
  static propTypes = {
    history: PropTypes.object,
    onSettingsSubmit: PropTypes.func,
    onServerChange: PropTypes.func,
    location: PropTypes.object,
    google: PropTypes.object,
    handleThemeChanger: PropTypes.func,
    mapKey: PropTypes.string,
    theme: PropTypes.string,
    enterAsSend: PropTypes.bool,
    micInput: PropTypes.bool,
    speechOutput: PropTypes.bool,
    speechOutputAlways: PropTypes.bool,
    speechRate: PropTypes.number,
    speechPitch: PropTypes.number,
    ttsLanguage: PropTypes.string,
    userName: PropTypes.string,
    prefLanguage: PropTypes.string,
    timeZone: PropTypes.string,
    customThemeValue: PropTypes.object,
    localStorage: PropTypes.bool,
    countryCode: PropTypes.string,
    countryDialCode: PropTypes.string,
    phoneNo: PropTypes.string,
    checked: PropTypes.bool,
    backgroundImage: PropTypes.string,
    messageBackgroundImage: PropTypes.string,
    email: PropTypes.string,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    if (!('speechSynthesis' in window)) {
      console.warn(
        'The current browser does not support the SpeechSynthesis API.',
      );
    }

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
      showServerChangeDialog: false,
      showChangePasswordDialog: false,
      showLogin: false,
      showSignUp: false,
      showForgotPassword: false,
      showOptions: false,
      showRemoveConfirmation: false,
      anchorEl: null,
    };
    this.isDirty = false;
    this.oldSettingSnapShot = {};
  }

  onThemeRequestClose = () => {
    // TODO
    // RESET THEME
    this.setState({ themeOpen: false });
  };

  // handleChange() function handles changing of textfield values on keypresses
  // handleChange = (e, name, i) => {
  //   const value = e.target.value;
  //   let data = this.state.obj;
  //   this.setState({
  //     obj: data.map((row, j) => (j === i ? { ...row, [name]: value } : row)),
  //   });
  // };

  // handleTabSlide = value => {
  //   this.setState({
  //     slideIndex: value,
  //   });
  // };

  // apiCall() function fetches user settings and devices from the server
  apiCall = () => {
    $.ajax({
      // url: url,
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

  preview = false;

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
      showRemoveConfirmation: false,
    });
  };

  handleThemeChanger = () => {
    // this.setState({ themeOpen: true });
    // switch (this.state.currTheme) {
    //   case 'light': {
    //     this.applyLightTheme();
    //     break;
    //   }
    //   case 'dark': {
    //     this.applyDarkTheme();
    //     break;
    //   }
    //   default: {
    //     let prevThemeSettings = {};
    //     let state = this.state;
    //     prevThemeSettings.currTheme = state.currTheme;
    //     prevThemeSettings.bodyColor = state.body;
    //     prevThemeSettings.TopBarColor = state.header;
    //     prevThemeSettings.composerColor = state.composer;
    //     prevThemeSettings.messagePane = state.pane;
    //     prevThemeSettings.textArea = state.textarea;
    //     prevThemeSettings.buttonColor = state.button;
    //     prevThemeSettings.bodyBackgroundImage = state.bodyBackgroundImage;
    //     prevThemeSettings.messageBackgroundImage = state.messageBackgroundImage;
    //     this.setState({ prevThemeSettings });
    //   }
    // }
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

  // Close settings and redirect to landing page
  onRequestClose = () => {
    this.props.history.push('/');
    window.location.reload();
  };

  // Show Top Bar drop down menu
  showOptions = event => {
    this.setState({
      showOptions: true,
      anchorEl: event.currentTarget,
    });
  };

  // Close Top Bar drop down menu
  closeOptions = () => {
    this.setState({
      showOptions: false,
    });
  };

  componentWillUnmount() {
    if (this.isDirty) {
      this.resetSettings();
    }
  }

  // eslint-disable-next-line
  componentDidMount() {
    document.body.className = 'white-body';
    // TODO
    // if (!this.state.dataFetched && cookies.get('loggedIn')) {
    //   this.apiCall();
    // }
    document.title =
      'Settings - SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';

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

  componentDidUpdate = prevProps => {
    if (this.isDirty && this.oldSettingSnapShot === {}) {
      this.oldSettingSnapShot = prevProps;
    }
  };

  // Generate language list drop down menu items
  populateVoiceList = () => {
    const { prefLanguage } = this.props;
    let langCodes = [];
    let voiceMenu = voiceList.map((voice, index) => {
      langCodes.push(voice.lang);
      return (
        <MenuItem
          value={voice.lang}
          key={index}
          primaryText={voice.name + ' (' + voice.lang + ')'}
        />
      );
    });

    let voiceOutput = {
      voiceMenu: voiceMenu,
      voiceLang: prefLanguage,
    };
    // `-` and `_` replacement check of lang codes
    if (langCodes.indexOf(prefLanguage) === -1) {
      if (
        prefLanguage.indexOf('-') > -1 &&
        langCodes.indexOf(prefLanguage.replace('-', '_')) > -1
      ) {
        voiceOutput.voiceLang = prefLanguage.replace('-', '_');
      } else if (
        prefLanguage.indexOf('_') > -1 &&
        langCodes.indexOf(prefLanguage.replace('_', '-')) > -1
      ) {
        voiceOutput.voiceLang = prefLanguage.replace('_', '-');
      }
    }
    return voiceOutput;
  };

  displaySaveChangesButton = () => {
    // TODO
    // GET RID OF THIS
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

  checkIsDirty = (e, value) => {
    if (this.isDirty) {
      this.resetSettings();
      this.isDirty = false;
    }
    this.setState({
      selectedSetting: window.innerWidth > 1060 ? value : e.target.innerText,
      settingNo: e.target.innerText,
    });
  };

  resetSettings = () => {
    const { actions } = this.props;
    const {
      theme,
      micInput,
      speechOutput,
      speechOutputAlways,
      speechPitch,
      speechRate,
      ttsLanguage,
      userName,
      timeZone,
      phoneNo,
      countryCode,
      enterAsSend,
      prefLanguage,
      countryDialCode,
      customThemeValue,
    } = this.oldSettingSnapShot;
    actions.setAccountSettings({
      userName,
      timeZone,
      prefLanguage,
    });
    actions.setMobileSettings({
      phoneNo,
      countryCode,
      countryDialCode,
    });
    actions.setChatPreferencesSettings({
      enterAsSend,
    });
    actions.setSpeechSettings({
      speechOutput,
      speechOutputAlways,
      speechRate,
      speechPitch,
      ttsLanguage,
    });
    actions.setMicrophoneSettings({
      micInput,
    });
    actions.setThemeSettings({
      theme,
      customThemeValue,
    });
    // ADD username change
  };

  saveSettings = () => {
    // TODO
    // Save not working when customThemeValues is being passed to it
    const {
      theme,
      micInput,
      speechOutput,
      speechOutputAlways,
      speechPitch,
      speechRate,
      ttsLanguage,
      userName,
      email,
      timeZone,
      phoneNo,
      countryCode,
      enterAsSend,
      prefLanguage,
      countryDialCode,
      actions,
      customThemeValue,
    } = this.props;
    actions
      .setUserSettings({
        theme,
        micInput,
        speechOutput,
        speechOutputAlways,
        speechPitch,
        speechRate,
        ttsLanguage,
        userName,
        email,
        timeZone,
        phoneNo,
        countryCode,
        enterAsSend,
        prefLanguage,
        countryDialCode,
        customThemeValue,
      })
      .then(response => {
        this.isDirty = false;
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleUserNameChange = (event, value) => {
    // TODO
    this.setState({ userName: value });
  };

  handleTimeZone = value => {
    this.isDirty = true;
    const { actions, userName, prefLanguage } = this.props;
    const { setAccountSettings } = actions;
    setAccountSettings({
      userName,
      timeZone: value,
      prefLanguage,
    });
  };

  handlePrefLang = (event, index, value) => {
    this.isDirty = true;
    const { actions, userName, timeZone } = this.props;
    const { setAccountSettings } = actions;
    setAccountSettings({
      userName,
      timeZone,
      prefLanguage: value,
    });
  };

  handleRemoveDevice = i => {
    // TODO
    const { actions } = this.props;
    const { removeUserDevice } = actions;
    let data = this.state.obj;
    let macid = data[i].macid;

    // Remove the row whose index does not matches the index passed in parameter
    this.setState({
      obj: data.filter((row, j) => j !== i),
    });

    removeUserDevice({
      macId: macid,
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleRemoveDeviceConfirmation = i => {
    // TODO
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

  // editIdx is set to the row index which is currently being edited
  startEditing = i => {
    // TODO
    this.setState({ editIdx: i });
  };

  // stopEditing() function handles saving of the changed device config
  stopEditing = i => {
    // TODO
    const { actions } = this.props;
    const { addUserDevice } = actions;
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

    addUserDevice({
      macId: macid,
      name: devicename,
      room,
      latitude,
      longitude,
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleCountryDetailsChange = (event, index, value) => {
    this.isDirty = true;
    const { actions, phoneNo } = this.props;
    const { setMobileSettings } = actions;
    setMobileSettings({
      phoneNo,
      countryCode: value,
      countryDialCode:
        countryData.countries[value ? value : 'US'].countryCallingCodes[0],
    });
  };

  handleTelephoneNoChange = (event, value) => {
    this.isDirty = true;
    const { actions, countryCode, countryDialCode } = this.props;
    const { setMobileSettings } = actions;
    const re = /^\d*$/;
    if (!value || re.test(value)) {
      setMobileSettings({
        phoneNo: value,
        countryCode,
        countryDialCode,
      });
    }
    if (!isPhoneNumber(value)) {
      this.setState({ phoneNoError: 'Invalid phone number' });
    } else {
      this.setState({ phoneNoError: '' });
    }
  };

  handleEnterAsSendChange = (event, isInputChecked) => {
    this.isDirty = true;
    const { actions } = this.props;
    const { setChatPreferencesSettings } = actions;
    setChatPreferencesSettings({
      enterAsSend: isInputChecked,
    });
  };

  handleMicInput = (event, isInputChecked) => {
    this.isDirty = true;
    const { actions } = this.props;
    const { setMicrophoneSettings } = actions;
    setMicrophoneSettings({
      micInput: isInputChecked,
    });
  };

  handleSpeechOutputChange = (event, isInputChecked) => {
    this.isDirty = true;
    const {
      speechOutputAlways,
      speechRate,
      speechPitch,
      ttsLanguage,
      actions,
    } = this.props;
    const { setSpeechSettings } = actions;
    setSpeechSettings({
      speechOutput: isInputChecked,
      speechOutputAlways,
      speechRate,
      speechPitch,
      ttsLanguage,
    });
  };

  handleSpeechOutputAlwaysChange = (event, isInputChecked) => {
    this.isDirty = true;
    const {
      speechOutput,
      speechRate,
      speechPitch,
      ttsLanguage,
      actions,
    } = this.props;
    const { setSpeechSettings } = actions;
    setSpeechSettings({
      speechOutput,
      speechOutputAlways: isInputChecked,
      speechRate,
      speechPitch,
      ttsLanguage,
    });
  };

  handleNewTextToSpeechChange = settings => {
    this.isDirty = true;
    const { speechOutput, speechOutputAlways, actions } = this.props;
    const { setSpeechSettings } = actions;
    setSpeechSettings({
      speechOutput,
      speechOutputAlways,
      speechRate: settings.speechRate,
      speechPitch: settings.speechPitch,
      ttsLanguage: settings.ttsLanguage,
    });
  };

  render() {
    const {
      theme,
      micInput,
      speechOutput,
      speechOutputAlways,
      speechPitch,
      speechRate,
      ttsLanguage,
      userName,
      email,
      timeZone,
      phoneNo,
      countryCode,
      enterAsSend,
      mapKey,
    } = this.props;
    const {
      selectedSetting,
      deviceData,
      obj,
      mapObj,
      centerLat,
      centerLng,
      devicenames,
      rooms,
      macids,
      slideIndex,
      editIdx,
      devicesNotAvailable,
      phoneNoError,
      settingNo,
      showRemoveConfirmation,
      removeDevice,
      removeDeviceName,
      themeOpen,
    } = this.state;
    // document.body.style.setProperty('background-image', 'none');

    const themeBackgroundColor = theme === 'dark' ? '#19324c' : '#fff';
    const themeForegroundColor = theme === 'dark' ? '#fff' : '#272727';
    const underlineStyle = {
      color: theme === 'dark' ? '#9E9E9E' : null,
      borderColor: theme === 'dark' ? '#9E9E9E' : null,
    };
    const menuIconColor = theme === 'dark' ? themeForegroundColor : null;
    sortCountryLexographical(countryData);

    const countries = countryData.countries.all.map((country, i) => {
      if (country.countryCallingCodes[0]) {
        return (
          <MenuItem
            value={country.alpha2}
            key={i}
            primaryText={`${country.name} ${country.countryCallingCodes[0]}`}
          />
        );
      }
      return null;
    });

    let currentSettingComponent = '';
    const voiceOutput = this.populateVoiceList();

    if (selectedSetting === 'Microphone') {
      currentSettingComponent = (
        <MicrophoneTab
          containerStyle={styles.divStyle}
          themeForegroundColor={themeForegroundColor}
          themeVal={theme}
          tabHeadingStyle={styles.tabHeadingStyle}
          micInput={micInput}
          handleMicInput={this.handleMicInput}
        />
      );
    } else if (selectedSetting === 'Share on Social media') {
      currentSettingComponent = (
        <ShareOnSocialMedia
          containerStyle={styles.divStyle}
          headingStyle={styles.headingStyle}
        />
      );
    } else if (selectedSetting === 'Theme') {
      currentSettingComponent = (
        <ThemeChangeTab
          containerStyle={styles.divStyle}
          tabHeadingStyle={styles.tabHeadingStyle}
          themeForegroundColor={themeForegroundColor}
          radioIconStyle={styles.radioIconStyle}
          themeVal={theme}
          theme={theme}
          handleSelectChange={this.handleSelectChange}
          isLoggedIn={cookies.get('loggedIn')}
          onThemeRequestClose={this.onRequestClose}
          handleThemeChanger={this.handleThemeChanger}
          themeOpen={themeOpen}
        />
      );
    } else if (selectedSetting === 'Speech') {
      currentSettingComponent = (
        <SpeechTab
          containerStyle={styles.divStyle}
          tabHeadingStyle={styles.tabHeadingStyle}
          headingStyle={styles.headingStyle}
          themeForegroundColor={themeForegroundColor}
          themeVal={theme}
          speechOutputAlways={speechOutputAlways}
          speechRate={speechRate}
          speechPitch={speechPitch}
          ttsLanguage={ttsLanguage}
          speechOutput={speechOutput}
          handleNewTextToSpeech={this.handleNewTextToSpeechChange}
          handleSpeechOutput={this.handleSpeechOutputChange}
          handleSpeechOutputAlways={this.handleSpeechOutputAlwaysChange}
        />
      );
    } else if (selectedSetting === 'Account' && cookies.get('loggedIn')) {
      currentSettingComponent = (
        <AccountTab
          containerStyle={styles.divStyle}
          themeForegroundColor={themeForegroundColor}
          fieldStyle={styles.fieldStyle}
          inputStyle={{
            ...styles.inputStyle,
            color: theme === 'dark' ? 'white' : 'black',
          }}
          headingStyle={styles.headingStyle}
          tabHeadingStyle={styles.tabHeadingStyle}
          themeBackgroundColor={themeBackgroundColor}
          themeVal={theme}
          userName={userName}
          email={email}
          timeZone={timeZone}
          voiceOutput={voiceOutput}
          handleUserName={this.handleUserNameChange}
          handlePrefLang={this.handlePrefLang}
          handleTimeZone={this.handleTimeZone}
        />
      );
    } else if (selectedSetting === 'Password') {
      currentSettingComponent = (
        <PasswordTab
          tabHeadingStyle={styles.tabHeadingStyle}
          containerStyle={styles.divStyle}
          themeVal={theme}
        />
      );
    } else if (selectedSetting === 'Devices') {
      currentSettingComponent = (
        <DevicesTab
          tabHeadingStyle={styles.tabHeadingStyle}
          containerStyle={styles.divStyle}
          themeVal={theme}
          deviceData={deviceData}
          tableData={obj}
          mapObj={mapObj}
          mapKey={mapKey}
          centerLat={centerLat}
          centerLng={centerLng}
          deviceNames={devicenames}
          rooms={rooms}
          macIds={macids}
          slideIndex={slideIndex}
          editIdx={editIdx}
          devicesNotAvailable={devicesNotAvailable}
          handleRemove={this.handleRemoveDevice}
          handleRemoveConfirmation={this.handleRemoveDeviceConfirmation}
          startEditing={this.startEditing}
          stopEditing={this.stopEditing}
        />
      );
    } else if (selectedSetting === 'Mobile') {
      currentSettingComponent = (
        <MobileTab
          containerStyle={styles.divStyle}
          floatingLabelStyle={{ color: '#9e9e9e' }}
          headingStyle={styles.headingStyle}
          tabHeadingStyle={styles.tabHeadingStyle}
          themeBackgroundColor={themeBackgroundColor}
          themeForegroundColor={themeForegroundColor}
          underlineStyle={underlineStyle}
          themeVal={theme}
          phoneNo={phoneNo}
          phoneNoError={phoneNoError}
          countryCode={countryCode}
          countries={countries}
          countryData={countryData.countries}
          handleCountryChange={this.handleCountryDetailsChange}
          handleTelephoneNoChange={this.handleTelephoneNoChange}
        />
      );
    } else {
      currentSettingComponent = (
        <ChatAppTab
          tabHeadingStyle={styles.tabHeadingStyle}
          containerStyle={styles.divStyle}
          themeVal={theme}
          themeForegroundColor={themeForegroundColor}
          enterAsSend={enterAsSend}
          handleEnterAsSend={this.handleEnterAsSendChange}
        />
      );
    }

    let blueThemeColor = { color: 'rgb(66, 133, 244)' };
    let menuItems = (
      <div>
        <div className="settings-list">
          <Menu
            selectedMenuItemStyle={blueThemeColor}
            style={{ width: '100%' }}
            onChange={this.checkIsDirty}
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
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
            {theme === 'light' ? (
              <hr className="break-line-light" />
            ) : (
              <hr className="break-line-dark" />
            )}
          </Menu>
        </div>

        <div className="settings-list-dropdown">
          <DropDownMenu
            selectedMenuItemStyle={blueThemeColor}
            onChange={this.checkIsDirty}
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
    );

    return (
      <div
        id="settings-container"
        className={
          (theme === 'light' && settingNo !== 'Theme') ||
          (settingNo === 'Theme' && theme === 'light')
            ? 'settings-container-light'
            : 'settings-container-dark'
        }
      >
        <Dialog
          className="dialogStyle"
          modal={false}
          open={showRemoveConfirmation}
          autoScrollBodyContent={true}
          contentStyle={{ width: '35%', minWidth: '300px' }}
          onRequestClose={this.handleClose}
        >
          <RemoveDeviceDialog
            {...this.props}
            deviceIndex={removeDevice}
            devicename={removeDeviceName}
            handleRemove={this.handleRemove}
          />
          <Close style={styles.closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
        <StaticAppBar
          settings={{ theme }}
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
          <Paper
            className="rightMenu"
            style={{
              ...styles.menuStyle,
              backgroundColor: themeBackgroundColor,
              color: themeForegroundColor,
            }}
            zDepth={1}
          >
            {currentSettingComponent}
            <div className="settingsSubmit">
              {this.displaySaveChangesButton() && (
                <RaisedButton
                  label={<Translate text="Save Changes" />}
                  disabled={
                    // !this.state.validForm ||
                    !this.isDirty
                    // ||
                    // this.state.phoneNoError
                  }
                  backgroundColor="#4285f4"
                  labelColor="#fff"
                  onClick={this.saveSettings}
                />
              )}
              {selectedSetting !== 'Account' ? (
                ''
              ) : (
                <div style={{ marginRight: '20px' }}>
                  {theme === 'light' ? (
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
                        Delete your account
                      </a>
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { mapKey } = store.app.apiKeys;
  const { userName, email } = store.app;
  return {
    mapKey,
    userName,
    email,
    ...store.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...settingsActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
