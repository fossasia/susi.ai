import React from 'react';
import Translate from '../../Translate/Translate.react';
import Avatar from './Avatar';
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
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import { voiceList } from './../../../constants/SettingsVoiceConstants.js';
import { getUserAvatarLink } from '../../../utils/getAvatarProps';
import styled from 'styled-components';
import urls from '../../../utils/urls';
import { setUserSettings, uploadAvatar } from '../../../apis';
import defaultAvatar from '../../../../public/defaultAvatar.png';

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

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const styles = {
  selectAvatarDropDownStyle: {
    width: '40%',
    minWidth: '9.5rem',
  },
};

class AccountTab extends React.Component {
  constructor(props) {
    super(props);
    const {
      timeZone,
      prefLanguage,
      userName,
      avatarType,
      accessToken,
    } = this.props;
    this.state = {
      timeZone,
      prefLanguage,
      userName,
      userNameError: '',
      avatarType,
      avatarSrc: defaultAvatar,
      file: '',
      imagePreviewUrl: getUserAvatarLink(accessToken),
      isAvatarAdded: false,
      uploadingAvatar: false,
      isAvatarUploaded: false,
      settingSave: false,
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

  handleAvatarTypeChange = event => {
    this.setState({
      avatarType: event.target.value,
      settingsChanged: true,
      isAvatarAdded: false,
      file: '',
      avatarSrc: '',
    });
  };

  handleAvatarSubmit = () => {
    const { file } = this.state;
    const { accessToken, actions } = this.props;
    // eslint-disable-next-line no-undef
    let form = new FormData();
    form.append('access_token', accessToken);
    form.append('image', file);
    this.setState({ uploadingAvatar: true });
    uploadAvatar(form).then(() => {
      actions.openSnackBar({
        snackBarMessage: 'Avatar Uploaded',
      });
      this.setState({
        uploadingAvatar: false,
        isAvatarAdded: true,
        isAvatarUploaded: true,
      });
    });
  };

  handleAvatarImageChange = e => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    let reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        isAvatarAdded: true,
      });
    };
    reader.readAsDataURL(file);
  };

  removeAvatarImage = () => {
    this.setState({
      file: '',
      isAvatarAdded: false,
      imagePreviewUrl: '',
      avatarSrc: '',
    });
  };

  handleSubmit = () => {
    const { timeZone, prefLanguage, userName, avatarType } = this.state;
    const { actions } = this.props;
    const payload = { timeZone, prefLanguage, userName, avatarType };
    setUserSettings(payload)
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions
            .setUserSettings(payload)
            .then(() => {
              this.setState({ settingSave: true });
            })
            .then(() => actions.updateUserAvatar());
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
    const {
      userNameError,
      userName,
      timeZone,
      prefLanguage,
      avatarType,
      avatarSrc,
      file,
      uploadingAvatar,
      imagePreviewUrl,
      isAvatarAdded,
      isAvatarUploaded,
      settingSave,
    } = this.state;
    const {
      email,
      theme,
      timeZone: _timeZone,
      prefLanguage: _prefLanguage,
      userName: _userName,
      avatarType: _avatarType,
    } = this.props;
    const disabled =
      (timeZone === _timeZone &&
        prefLanguage === _prefLanguage &&
        userName === _userName &&
        (avatarType !== 'server'
          ? avatarType === _avatarType
          : !isAvatarUploaded || !isAvatarAdded || settingSave)) ||
      userNameError;
    return (
      <SettingsTabWrapper heading="Account">
        <Container>
          <div>
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
          </div>
          <div className="img-upld">
            <TabHeading>Select Avatar</TabHeading>
            <Select
              onChange={this.handleAvatarTypeChange}
              value={avatarType}
              style={styles.selectAvatarDropDownStyle}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="server">Upload</MenuItem>
              <MenuItem value="gravatar">Gravatar</MenuItem>
            </Select>
            <Avatar
              avatarType={avatarType}
              handleAvatarSubmit={this.handleAvatarSubmit}
              uploadingAvatar={uploadingAvatar}
              imagePreviewUrl={imagePreviewUrl}
              isAvatarAdded={isAvatarAdded}
              isAvatarUploaded={isAvatarUploaded}
              handleAvatarImageChange={this.handleAvatarImageChange}
              removeAvatarImage={this.removeAvatarImage}
              file={file}
              avatarSrc={avatarSrc}
              email={email}
            />
          </div>
        </Container>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={disabled}
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
  accessToken: PropTypes.string,
  actions: PropTypes.object,
  avatarType: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    userName: store.settings.userName,
    timeZone: store.settings.timeZone,
    prefLanguage: store.settings.prefLanguage,
    email: store.app.email,
    accessToken: store.app.accessToken,
    theme: store.settings.theme,
    avatarType: store.settings.avatarType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...settingActions, ...appActions, ...uiActions },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountTab);
