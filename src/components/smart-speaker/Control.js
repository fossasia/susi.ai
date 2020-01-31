import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../redux/actions/ui';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Shuffle from '@material-ui/icons/Shuffle';
import Stop from '@material-ui/icons/Stop';
import styled from 'styled-components';
import Replay from '@material-ui/icons/Replay';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import Refresh from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '../shared/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import OutlinedTextField from '../shared/OutlinedTextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
  resumeAction,
  pauseAction,
  restartAction,
  stopAction,
  previousAction,
  shuffleAction,
  nextAction,
  setVolumeAction,
  playInYoutubeAction,
  refreshDeviceList,
  setControlOptions,
  setWifiSettings,
  unlinkUserDevice,
} from '../../apis';
import {
  Section,
  Overlay,
  OverlayContainer,
  ControlHeading,
  FlexContainer,
  CustomButton,
  Bold,
} from '../cms/MyDevices/styles';
import { withRouter } from 'react-router-dom';

const Paper = styled(OverlayContainer)`
  width: 100%;
  padding: 1rem 2.25rem 3rem;
  @media (max-width: 740) {
    padding: 0 0 3rem;
  }
`;

const SubHeading = styled.h1`
  color: rgba(0, 0, 0, 0.65);
`;

class ControlSection extends React.Component {
  static propTypes = {
    isLocalEnv: PropTypes.bool,
    actions: PropTypes.object,
    location: PropTypes.object,
    userName: PropTypes.string,
    email: PropTypes.string,
    macId: PropTypes.string,
    devices: PropTypes.object,
    deviceName: PropTypes.string,
  };

  state = {
    volume: 50,
    youtubeLink: '',
    devicesList: [],
    selectedDevice: '',
    stt: 'google',
    tts: 'google',
    hotword: 'Snowboy',
    wifissid: '',
    wifipassd: '',
    synchronizePublicSkills: false,
    synchronizePrivateSkills: false,
    loading: true,
  };

  handleVolumeChange = (e, volume) => {
    this.setState({
      volume,
    });
    setVolumeAction({ volume });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  populateDeviceList = async () => {
    try {
      let { data } = await refreshDeviceList();
      this.setState({
        devicesList: data,
        selectedDevice: '',
      });
    } catch (error) {
      const { actions } = this.props;
      actions.openSnackBar({
        snackBarMessage: 'Failed to fetch the devices',
        snackBarDuration: 2000,
      });
      console.log(error);
    }
  };

  handleDeviceSelect = e => {
    this.setState({
      selectedDevice: e.target.value,
    });
  };

  handleRadioChange = async e => {
    const { actions } = this.props;
    const { name, value } = e.target;
    this.setState({ [name]: value }, async () => {
      const { stt, tts, hotword } = this.state;
      try {
        await setControlOptions({
          stt,
          tts,
          hotword,
        });
        actions.openSnackBar({
          snackBarMessage: 'Successfully updated Speaker configuration',
        });
      } catch (error) {
        actions.openSnackBar({
          snackBarMessage: 'Failed to update Speaker configuration',
        });
      }
    });
  };

  saveWiFiSettings = async () => {
    const { actions } = this.props;
    const { wifissid, wifipassd } = this.state;
    try {
      await setWifiSettings({ wifissid, wifipassd });
      actions.openSnackBar({
        snackBarMessage: 'Saved the WiFi settings',
      });
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: 'Failed to save WiFi settings',
      });
    }
  };

  handleCheck = event => {
    this.setState({
      [event.target.name]: event.target.checked,
    });
  };

  handleRemoveDevice = async () => {
    const { macId, actions } = this.props;
    try {
      let { accepted = false } = await unlinkUserDevice({ macId });
      if (accepted) {
        actions.closeModal();
        actions.openSnackBar({
          snackBarMessage: 'Device successfully unlinked!',
        });
      }
      actions.openSnackBar({
        snackBarMessage: 'Unable to unlink Device',
      });
    } catch (error) {
      console.log(error);
      actions.openSnackBar({
        snackBarMessage: 'Unable to unlink Device',
      });
    }
  };

  handleRemoveConfirmation = () => {
    const { deviceName = 'Device not found' } = this.props;
    this.props.actions.openModal({
      modalType: 'deleteDevice',
      name: deviceName,
      handleConfirm: this.handleRemoveDevice,
      handleClose: this.props.actions.closeModal,
    });
  };

  render() {
    const {
      volume,
      youtubeLink,
      devicesList,
      selectedDevice,
      stt,
      tts,
      hotword,
      wifissid,
      wifipassd,
      synchronizePublicSkills,
      synchronizePrivateSkills,
    } = this.state;
    const { isLocalEnv, userName, email, macId } = this.props;
    return (
      <React.Fragment>
        <Paper>
          {!isLocalEnv && (
            <Overlay>
              You need to access this page on your device to control your
              device.
            </Overlay>
          )}
          <SubHeading>Media Player</SubHeading>
          <Section>
            <ControlHeading>Volume</ControlHeading>
            <Grid container spacing={2}>
              <Grid item>
                <VolumeDown />
              </Grid>
              <Grid item xs>
                <Slider
                  value={volume}
                  valueLabelDisplay="auto"
                  onChange={this.handleVolumeChange}
                />
              </Grid>
              <Grid item>
                <VolumeUp />
              </Grid>
            </Grid>
          </Section>

          <ControlHeading>Playback Control</ControlHeading>
          <Grid container spacing={1}>
            <Grid item>
              <Button variant="outlined" onClick={pauseAction}>
                Pause
                <Pause />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="inherit"
                onClick={resumeAction}
                style={{ color: 'green' }}
              >
                Play
                <PlayArrow />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={restartAction}
              >
                Restart
                <Replay />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="inherit"
                onClick={stopAction}
                style={{ color: 'red' }}
              >
                Stop
                <Stop />
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={previousAction}>
                Previous
                <SkipPrevious />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={shuffleAction}
              >
                Shuffle
                <Shuffle />
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={nextAction}>
                Next
                <SkipNext />
              </Button>
            </Grid>
          </Grid>
          <Section>
            <ControlHeading>Play YouTube songs</ControlHeading>
            <FlexContainer>
              <OutlinedTextField
                label="YouTube link"
                placeholder="YouTube link"
                value={youtubeLink || ''}
                name="youtubeLink"
                style={{ marginRight: '2rem', width: '80%' }}
                onChange={this.handleChange}
                margin="dense"
              />
              <Button
                variant="outlined"
                color="inherit"
                disabled={!youtubeLink}
                onClick={() => playInYoutubeAction({ youtubeLink })}
                style={{ color: 'green' }}
              >
                Play
                <PlayArrow />
              </Button>
            </FlexContainer>
          </Section>
          <Section>
            <ControlHeading>Play songs from your local device</ControlHeading>
            <FlexContainer>
              <Select
                value={selectedDevice}
                onChange={this.handleDeviceSelect}
                style={{ marginRight: '2rem', width: '80%' }}
                disabled={devicesList.length === 0}
                input={<OutlinedTextField name="devices" margin="dense" />}
              >
                {devicesList &&
                  Array.isArray(devicesList) &&
                  devicesList.length > 0 &&
                  devicesList.map((eachDevice, index) => (
                    <MenuItem key={index} value={eachDevice.name}>
                      {eachDevice.name}
                    </MenuItem>
                  ))}
              </Select>
              <Fab color="primary" onClick={this.populateDeviceList}>
                <Refresh />
              </Fab>
            </FlexContainer>
          </Section>
        </Paper>
        <Paper style={{ marginTop: '1rem' }}>
          {!isLocalEnv && (
            <Overlay>
              You need to access this page on your device to control your
              device.
            </Overlay>
          )}
          <SubHeading>Device Controls</SubHeading>
          <Section>
            <ControlHeading>Speech To Text (STT)</ControlHeading>
            <Select
              value={stt}
              onChange={this.handleChange}
              fullWidth={true}
              input={<OutlinedInput name="stt" id="stt" margin="dense" />}
            >
              <MenuItem value="google">Google</MenuItem>
              <MenuItem value="watson">Watson</MenuItem>
              <MenuItem value="bing">Bing</MenuItem>
              <MenuItem value="pocketsphinx">Pocket Sphinx</MenuItem>
            </Select>
          </Section>
          <Section>
            <ControlHeading>Text To Speech (TTS)</ControlHeading>
            <Select
              value={tts}
              onChange={this.handleChange}
              fullWidth={true}
              input={<OutlinedInput name="tts" id="tts" margin="dense" />}
            >
              <MenuItem value="google">Google</MenuItem>
              <MenuItem value="watson">Watson</MenuItem>
              <MenuItem value="flite">Flite</MenuItem>
            </Select>
          </Section>

          <Section>
            <ControlHeading>Set Hotword Engine</ControlHeading>
            <Select
              value={hotword}
              onChange={this.handleChange}
              fullWidth={true}
              input={
                <OutlinedInput name="hotword" id="hotword" margin="dense" />
              }
            >
              <MenuItem value="Snowboy">Snowboy</MenuItem>
              <MenuItem value="PocketSphinx">Pocket Sphinx</MenuItem>
            </Select>
          </Section>
          <Section>
            <ControlHeading>Add WiFi Access Point Credentials</ControlHeading>
            <OutlinedTextField
              name="wifissid"
              value={wifissid}
              onChange={this.handleChange}
              placeholder="WiFi SSID"
              label="WiFi SSID"
              fullWidth={true}
              margin="dense"
            />
            <OutlinedTextField
              name="wifipassd"
              value={wifipassd}
              onChange={this.handleChange}
              placeholder="WiFi Password"
              label="WiFi Password"
              fullWidth={true}
              margin="dense"
            />
            <Button
              style={{ marginTop: '1rem' }}
              color="primary"
              variant="contained"
              onClick={this.saveWiFiSettings}
            >
              Save
            </Button>
          </Section>
          <Section>
            <ControlHeading>Skill Synchronization</ControlHeading>
            <FormControlLabel
              control={
                <Checkbox
                  name="synchronizePublicSkills"
                  checked={synchronizePublicSkills}
                  onChange={this.handleCheck}
                  color="primary"
                  disabled={!isLocalEnv}
                />
              }
              label="(Coming Soon) Synchronize local skills with SUSI.AI skills database regularly"
            />
            <CustomButton
              variant="contained"
              color="primary"
              size="small"
              disabled={!isLocalEnv}
            >
              Synchronize Now
            </CustomButton>
            <FormControlLabel
              control={
                <Checkbox
                  name="synchronizePrivateSkills"
                  checked={synchronizePrivateSkills}
                  onChange={this.handleCheck}
                  color="primary"
                  disabled={!isLocalEnv}
                />
              }
              label="(Coming Soon) Synchronize (upload) private skills I create locally with my online account when online"
            />
            <CustomButton
              variant="contained"
              color="primary"
              size="small"
              disabled={!isLocalEnv}
            >
              Upload Now
            </CustomButton>
          </Section>
          <Section>
            <ControlHeading>Linked Account</ControlHeading>
            <Bold>
              Device linked to SUSI.AI account{' '}
              {userName !== '' ? userName : email}
            </Bold>
            <div style={{ marginTop: '1rem' }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={this.handleRemoveConfirmation}
                disabled={!isLocalEnv || macId === ''}
              >
                Unlink
              </Button>
            </div>
          </Section>
        </Paper>
      </React.Fragment>
    );
  }
}

function mapStateToProps(store) {
  return {
    isLocalEnv: store.app.isLocalEnv,
    email: store.app.email,
    userName: store.settings.userName,
    devices: store.settings.devices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ControlSection),
);
