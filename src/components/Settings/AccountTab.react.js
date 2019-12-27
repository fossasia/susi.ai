import React from 'react';
import Translate from '../Translate/Translate.react';
import Avatar from './Avatar';
import { connect } from 'react-redux';
import SettingsTabWrapper from './SettingsTabWrapper';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '../shared/Button';
import Select from '../shared/Select';
import MenuItem from '@material-ui/core/MenuItem';
import _TimezonePicker from 'react-timezone';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { TabHeading } from './SettingStyles';
import settingActions from '../../redux/actions/settings';
import uiActions from '../../redux/actions/ui';
import appActions from '../../redux/actions/app';
import { voiceList } from '../../constants/SettingsVoiceConstants.js';
import { getUserAvatarLink } from '../../utils/getAvatarProps';
import styled from 'styled-components';
import { setUserSettings, uploadAvatar, deleteUserAccount } from '../../apis';
import defaultAvatar from '../../images/defaultAvatar.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import isUserName from '../../utils/isUserName';

const TimezonePicker = styled(_TimezonePicker)`
  & > ul {
    background-color: #fff;
  }
`;

const TimezoneContainer = styled.div`
  padding-bottom: 30px;
`;

const Timezone = styled.div`
  position: relative;
  z-index: 99;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DangerContainer = styled.div`
  border: 1px solid #d73a49;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  align-items: center;
`;

const DangerButton = styled(Button)`
  background-color: #fafbfc;
  color: #cb2431;
  &:hover {
    background-color: #ff0000;
    color: #fff;
  }
`;

const AvatarSection = styled.div`
  margin-left: 8rem;
  @media (min-width: 766px) and (max-width: 1060px) {
    margin-left: 40%;
    padding-top: 0.5rem;
  }
  @media (min-width: 623px) and (max-width: 765px) {
    padding-top: 0.5rem;
    margin-left: 25%;
  }
  @media (max-width: 622px) {
    padding-top: 0.5rem;
    margin-left: 0px;
    width: 100%;
  }
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
      userEmailId,
    } = this.props;
    this.state = {
      timeZone,
      prefLanguage,
      userName,
      userNameError: '',
      avatarType,
      avatarSrc: defaultAvatar,
      file: '',
      imagePreviewUrl: getUserAvatarLink({ userEmailId }),
      isAvatarAdded: false,
      uploadingAvatar: false,
      isAvatarUploaded: false,
      settingSave: false,
      avatarAnchorEl: null,
      loading: false,
      deleteUserByAdminEmail: '',
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
    let currLang = this.state.prefLanguage || '';
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
    this.setState({ userName });
    if (!isUserName(userName)) {
      this.setState({
        userNameError: 'Enter atleast 5 character, upto 51 character',
      });
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

  handleAvatarSubmit = async () => {
    const { file } = this.state;
    const { accessToken, actions, userEmailId } = this.props;
    // eslint-disable-next-line no-undef
    let form = new FormData();
    form.append('access_token', accessToken);
    userEmailId && form.append('email', userEmailId);
    form.append('image', file);
    this.setState({ uploadingAvatar: true });
    await uploadAvatar(form);
    actions.openSnackBar({
      snackBarMessage: 'Avatar Uploaded',
    });
    this.setState({
      uploadingAvatar: false,
      isAvatarAdded: true,
      isAvatarUploaded: true,
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
    this.handleMenuClose();
  };

  removeAvatarImage = () => {
    this.setState({
      file: '',
      isAvatarAdded: false,
      imagePreviewUrl: '',
      avatarSrc: '',
    });
  };

  handleMenuClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleSubmit = async () => {
    const { timeZone, prefLanguage, userName, avatarType } = this.state;
    const { actions, userEmailId } = this.props;
    if (!(userName.trim().length > 0)) {
      this.setState({
        userNameError:
          'A valid username is required before setting timezone or preferred language!',
      });
      return;
    }

    let payload = {
      timeZone,
      prefLanguage,
      userName,
      avatarType,
    };
    payload = userEmailId !== '' ? { ...payload, email: userEmailId } : payload;
    this.setState({ loading: true });
    try {
      let data = await setUserSettings(payload);
      if (data.accepted) {
        actions.openSnackBar({
          snackBarMessage: 'Settings updated',
        });
        await actions.setUserSettings(payload);
        await this.setState({ settingSave: true, loading: false });
        userEmailId === '' && actions.updateUserAvatar();
      } else {
        actions.openSnackBar({
          snackBarMessage: 'Failed to save Settings',
        });
        this.setState({ loading: false });
      }
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: 'Failed to save Settings',
      });
    }
  };

  deleteUser = async () => {
    const { deleteUserByAdminEmail: email } = this.state;
    try {
      await deleteUserAccount({ email });
      this.props.actions.openSnackBar({
        snackBarMessage: `Account associated with ${email} is deleted successfully!`,
        snackBarDuration: 2000,
      });
      window.location.replace('/admin/users');
    } catch (error) {
      console.log(error);
      this.props.actions.openSnackBar({
        snackBarMessage: `Account associated with ${email} cannot be deleted!!`,
        snackBarDuration: 2000,
      });
    }
  };

  handleDelete = deleteUserByAdminEmail => {
    this.setState({ deleteUserByAdminEmail });
    this.props.actions.openModal({
      modalType: 'deleteUserAccount',
      userEmail: deleteUserByAdminEmail,
      handleClose: this.props.actions.closeModal,
      handleConfirm: this.deleteUser,
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
      loading,
    } = this.state;
    const {
      actions,
      email,
      timeZone: _timeZone,
      prefLanguage: _prefLanguage,
      userName: _userName,
      avatarType: _avatarType,
      userEmailId,
    } = this.props;
    const disabled =
      (timeZone === _timeZone &&
        prefLanguage === _prefLanguage &&
        userName === _userName &&
        (avatarType !== 'server'
          ? avatarType === _avatarType
          : !isAvatarUploaded || !isAvatarAdded || settingSave)) ||
      userNameError ||
      loading;

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <SettingsTabWrapper heading="Account">
        <Container>
          <div>
            <TabHeading>
              <Translate text="User Name" />
            </TabHeading>
            <FormControl
              error={userNameError !== ''}
              style={{ maxWidth: '250px' }}
              disabled={loading}
            >
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
            <TabHeading>
              <Translate text="Email" />
            </TabHeading>
            <OutlinedInput
              labelWidth={0}
              name="email"
              value={userEmailId !== '' ? userEmailId : email}
              style={{ width: '16rem', height: '2.1rem' }}
              disabled={true}
            />
            <TabHeading>
              <Translate text="Select default language" />
            </TabHeading>
            <Select
              value={voiceOutput.voiceLang}
              disabled={!this.TTSBrowserSupport | loading}
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
                  className="time-zone-picker"
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
          <AvatarSection>
            <TabHeading>Select Avatar</TabHeading>
            <div>
              <Select
                onChange={this.handleAvatarTypeChange}
                value={avatarType}
                style={styles.selectAvatarDropDownStyle}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="server">Upload</MenuItem>
                <MenuItem value="gravatar">Gravatar</MenuItem>
              </Select>
            </div>
            <Avatar
              avatarType={avatarType}
              handleAvatarSubmit={this.handleAvatarSubmit}
              uploadingAvatar={uploadingAvatar}
              imagePreviewUrl={imagePreviewUrl}
              isAvatarAdded={isAvatarAdded}
              isAvatarUploaded={isAvatarUploaded}
              handleAvatarImageChange={this.handleAvatarImageChange}
              removeAvatarImage={this.removeAvatarImage}
              handleMenuClick={this.handleMenuClick}
              handleMenuClose={this.handleMenuClose}
              open={open}
              anchorEl={anchorEl}
              file={file}
              avatarSrc={avatarSrc}
              email={userEmailId !== '' ? userEmailId : email}
            />
          </AvatarSection>
        </Container>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={disabled}
          style={{ margin: '1.5rem 0' }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Translate text="Save Changes" />
          )}
        </Button>
        <TabHeading>
          <Translate text="Danger Zone" />
        </TabHeading>
        <DangerContainer>
          <div>
            <TabHeading>
              <Translate text="Delete account" />
            </TabHeading>
            <Translate text="Once you delete account, there is no going back. Please be certain." />
          </div>
          <div>
            <DangerButton
              variant="contained"
              onClick={() =>
                userEmailId !== ''
                  ? this.handleDelete(userEmailId)
                  : actions.openModal({ modalType: 'deleteAccount' })
              }
            >
              Delete
            </DangerButton>
          </div>
        </DangerContainer>
      </SettingsTabWrapper>
    );
  }
}

AccountTab.propTypes = {
  timeZone: PropTypes.string,
  userName: PropTypes.string,
  prefLanguage: PropTypes.string,
  email: PropTypes.string,
  accessToken: PropTypes.string,
  actions: PropTypes.object,
  avatarType: PropTypes.string,
  userEmailId: PropTypes.string,
};

function mapStateToProps(store) {
  const userSettingsViewedByAdmin = store.settings.userSettingsViewedByAdmin;
  const { email } = userSettingsViewedByAdmin;
  const settings = email !== '' ? userSettingsViewedByAdmin : store.settings;
  return {
    userName: settings.userName,
    timeZone: settings.timeZone,
    prefLanguage: settings.prefLanguage,
    email: store.app.email,
    userEmailId: email, // Admin access : email Id of the user being accesed
    accessToken: store.app.accessToken,
    avatarType: settings.avatarType,
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
