import React from 'react';
import Translate from '../../Translate/Translate.react';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import TimezonePicker from 'react-timezone';
import PropTypes from 'prop-types';

const AccountTab = props => {
  let TTSBrowserSupport;
  if ('speechSynthesis' in window) {
    TTSBrowserSupport = true;
  } else {
    TTSBrowserSupport = false;
    console.warn(
      'The current browser does not support the SpeechSynthesis API.',
    );
  }

  return (
    <div style={props.containerStyle}>
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
        {props.themeVal === 'light' ? (
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
        style={props.fieldStyle}
        value={props.userName}
        onChange={props.handleUserName}
        inputStyle={props.inputStyle}
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
        style={props.fieldStyle}
        value={props.identityName}
        inputStyle={props.inputStyle}
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
        value={props.voiceOutput.voiceLang}
        style={{ marginLeft: '-20px' }}
        disabled={!TTSBrowserSupport}
        labelStyle={{ color: props.themeForegroundColor }}
        menuStyle={{ backgroundColor: props.themeBackgroundColor }}
        menuItemStyle={{ color: props.themeForegroundColor }}
        onChange={props.handlePrefLang}
      >
        {props.voiceOutput.voiceMenu}
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
        value={props.timeZone}
        onChange={timezone => props.handleTimeZone(timezone)}
        inputProps={{
          placeholder: 'Select Timezone...',
          name: 'timezone',
        }}
      />
    </div>
  );
};

AccountTab.propTypes = {
  timeZone: PropTypes.string,
  userName: PropTypes.string,
  containerStyle: PropTypes.object,
  fieldStyle: PropTypes.object,
  handlePrefLang: PropTypes.func,
  handleTimeZone: PropTypes.func,
  handleUserName: PropTypes.func,
  identityName: PropTypes.string,
  inputStyle: PropTypes.object,
  themeBackgroundColor: PropTypes.string,
  themeForegroundColor: PropTypes.string,
  themeVal: PropTypes.string,
  voiceOutput: PropTypes.object,
};

export default AccountTab;
