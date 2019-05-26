import React from 'react';
import Translate from '../../Translate/Translate.react';
import { connect } from 'react-redux';
import SettingsTabWrapper from './SettingsTabWrapper';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TimezonePicker from 'react-timezone';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { TabHeading, Divider } from './SettingStyles';
import settingActions from '../../../redux/actions/settings';
import uiActions from '../../../redux/actions/ui';
import { voiceList } from './../../../constants/SettingsVoiceConstants.js';
import styled from 'styled-components';
import urls from '../../../utils/urls';
import { setUserSettings } from '../../../apis';

const EmailHeading = styled(TabHeading)`
  margin-top: 0;
`;

const TimezoneContainer = styled.div`
  padding-bottom: 30px;
`;

const Timezone = styled.div`
  position: absolute;
  z-index: 99;
`;

class AccountTab extends React.Component {
  constructor(props) {
    super(props);
    const { timeZone, prefLanguage, userName } = this.props;
    this.state = {
      timeZone,
      prefLanguage,
      userName,
      userNameError: '',
    };
    if ('speechSynthesis' in window) {
      this.TTSBrowserSupport = true;
    } else {
      this.TTSBrowserSupport = false;
      console.warn(
        'The current browser does not support the SpeechSynthesis API.',
      );
    }
  }

  // Generate language list drop down menu items
  populateVoiceList = () => {
    let langCodes = [];
    let voiceMenu = voiceList.map((voice, index) => {
      langCodes.push(voice.lang);
      return (
        <MenuItem value={voice.lang} key={index}>
          {voice.name + ' (' + voice.lang + ')'}
        </MenuItem>
      );
    });
    let currLang = this.state.prefLanguage;
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

  handlePrefLang = event => {
    this.setState({
      prefLanguage: event.target.value,
    });
  };

  handleTimeZone = value => {
    this.setState({
      timeZone: value,
    });
  };

  handleUserName = event => {
    const { value: userName } = event.target;
    const re = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
    this.setState({ userName });
    if (userName !== '' && !re.test(userName)) {
      this.setState({ userNameError: 'Invalid User Name' });
    } else {
      this.setState({ userNameError: '' });
    }
  };

  handleSubmit = () => {
    const { timeZone, prefLanguage, userName } = this.state;
    const { actions } = this.props;
    const payload = { timeZone, prefLanguage, userName };
    setUserSettings(payload)
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions.setUserSettings(payload);
        } else {
          actions.openSnackBar({
            snackBarMessage: 'Failed to save Settings',
          });
        }
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: 'Failed to save Settings',
        });
      });
  };

  render() {
    const voiceOutput = this.populateVoiceList();
    const { userNameError, userName, timeZone, prefLanguage } = this.state;
    const { email, theme } = this.props;
    return (
      <SettingsTabWrapper heading="Account">
        <TabHeading>
          <Translate text="User Name" />
        </TabHeading>
        <FormControl error={userNameError !== ''}>
          <OutlinedInput
            labelWidth={0}
            name="username"
            value={userName}
            onChange={this.handleUserName}
            aria-describedby="email-error-text"
            style={{ width: '16rem', height: '2.1rem' }}
            placeholder="Enter your User Name"
          />
          <FormHelperText error={userNameError !== ''}>
            {userNameError}
          </FormHelperText>
        </FormControl>
        <EmailHeading>
          <Translate text="Email" />
        </EmailHeading>
        <OutlinedInput
          labelWidth={0}
          name="email"
          value={email}
          style={{ width: '16rem', height: '2.1rem' }}
          disabled={true}
        />
        <TabHeading>
          <Translate text="Select default language" />
        </TabHeading>
        <Select
          value={voiceOutput.voiceLang}
          disabled={!this.TTSBrowserSupport}
          onChange={this.handlePrefLang}
          style={{ margin: '1rem 0' }}
        >
          {voiceOutput.voiceMenu}
        </Select>
        <TabHeading>
          <Translate text="Select TimeZone" />
        </TabHeading>
        <TimezoneContainer>
          <Timezone>
            <TimezonePicker
              value={timeZone}
              onChange={timezone => this.handleTimeZone(timezone)}
              inputProps={{
                placeholder: 'Select Timezone...',
                name: 'timezone',
              }}
            />
          </Timezone>
        </TimezoneContainer>

        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={
            (timeZone === this.props.timeZone &&
              prefLanguage === this.props.prefLanguage &&
              userName === this.props.userName) ||
            userNameError
          }
          style={{ marginTop: '1.5rem' }}
        >
          <Translate text="Save Changes" />
        </Button>
        <div style={{ marginRight: '20px' }}>
          <Divider marginTop="25px" theme={theme} />
          <p style={{ textAlign: 'center' }}>
            <span className="Link">
              <a href={`${urls.ACCOUNT_URL}/delete-account`}>
                Delete your account
              </a>
            </span>
          </p>
        </div>
      </SettingsTabWrapper>
    );
  }
}

AccountTab.propTypes = {
  timeZone: PropTypes.string,
  userName: PropTypes.string,
  prefLanguage: PropTypes.string,
  email: PropTypes.string,
  theme: PropTypes.string,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    userName: store.settings.userName,
    timeZone: store.settings.timeZone,
    prefLanguage: store.settings.prefLanguage,
    email: store.app.email,
    theme: store.settings.theme,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...settingActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountTab);
