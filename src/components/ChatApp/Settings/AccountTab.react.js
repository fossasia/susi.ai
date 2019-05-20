import React from 'react';
import Translate from '../../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
    <SettingsTabWrapper heading="Account" theme={props.themeVal}>
      <div style={props.headingStyle}>
        <Translate text="User Name" />
      </div>
      <FormControl error={props.userNameError !== ''}>
        <OutlinedInput
          labelWidth={0}
          name="username"
          value={props.userName}
          onChange={props.handleUserName}
          aria-describedby="email-error-text"
          style={{ width: '16rem', height: '2.1rem' }}
          placeholder="Enter your User Name"
        />
        <FormHelperText error={props.userNameError !== ''}>
          {props.userNameError}
        </FormHelperText>
      </FormControl>
      <div style={{ ...props.headingStyle, marginTop: '0' }}>
        <Translate text="Email" />
      </div>
      <OutlinedInput
        labelWidth={0}
        name="email"
        value={props.identityName}
        style={{ width: '16rem', height: '2.1rem' }}
        disabled={true}
      />
      <div style={{ ...props.headingStyle, marginBottom: 0 }}>
        <Translate text="Select default language" />
      </div>
      <Select
        value={props.voiceOutput.voiceLang}
        disabled={!TTSBrowserSupport}
        onChange={props.handlePrefLang}
        style={{ margin: '1rem 0' }}
      >
        {props.voiceOutput.voiceMenu}
      </Select>
      <div style={props.headingStyle}>
        <Translate text="Select TimeZone" />
      </div>
      <div className="time-zone">
        <div className="time-zone-dropdown">
          <TimezonePicker
            value={props.timeZone}
            onChange={timezone => props.handleTimeZone(timezone)}
            inputProps={{
              placeholder: 'Select Timezone...',
              name: 'timezone',
            }}
          />
        </div>
      </div>
    </SettingsTabWrapper>
  );
};

AccountTab.propTypes = {
  timeZone: PropTypes.string,
  userName: PropTypes.string,
  containerStyle: PropTypes.object,
  tabHeadingStyle: PropTypes.object,
  headingStyle: PropTypes.object,
  userNameError: PropTypes.string,
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
