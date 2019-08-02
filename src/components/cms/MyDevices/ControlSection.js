import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Shuffle from '@material-ui/icons/Shuffle';
import Stop from '@material-ui/icons/Stop';
import Replay from '@material-ui/icons/Replay';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import Refresh from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '../../shared/Select';
import OutlinedTextField from '../../shared/OutlinedTextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
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
} from '../../../apis';
import {
  Section,
  Overlay,
  OverlayContainer,
  ControlHeading,
  FlexContainer,
} from './styles';

class ControlSection extends React.Component {
  static propTypes = {
    isLocalEnv: PropTypes.bool,
    actions: PropTypes.object,
  };

  state = {
    volume: 50,
    youtubeLink: '',
    devicesList: [],
    selectedDevice: '',
    stt: 'google',
    tts: 'google',
    hotword: 'Snowboy',
    wake: 'y',
  };

  componentDidMount() {
    this.populateDeviceList();
  }

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

  populateDeviceList = () => {
    refreshDeviceList().then(({ data }) => {
      this.setState({
        devicesList: data,
        selectedDevice: '',
      });
    });
  };

  handleDeviceSelect = e => {
    this.setState({
      selectedDevice: e.target.value,
    });
  };

  handleRadioChange = e => {
    const { actions } = this.props;
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      const { stt, tts, hotword, wake } = this.state;
      setControlOptions({
        stt,
        tts,
        hotword,
        wake,
      })
        .then(() => {
          actions.openSnackBar({
            snackBarMessage: 'Successfully updated Speaker configuration',
          });
        })
        .catch(error => {
          actions.openSnackBar({
            snackBarMessage: 'Failed to update Speaker configuration',
          });
        });
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
      wake,
    } = this.state;
    const { isLocalEnv } = this.props;
    return (
      <OverlayContainer>
        {!isLocalEnv && (
          <Overlay>
            {/* You need to access this page on your device to control your device. */}
            Coming Soon
          </Overlay>
        )}
        <h1>Controls</h1>
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
        <Section>
          <ControlHeading>Playback Control</ControlHeading>
          <Grid container spacing={2}>
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
                Resume
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
        </Section>
        <Section>
          <ControlHeading>Play YouTube songs</ControlHeading>
          <OutlinedTextField
            label="YouTube link"
            placeholder="YouTube link"
            value={youtubeLink || ''}
            name="youtubeLink"
            fullWidth
            onChange={this.handleChange}
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
        </Section>
        <Section>
          <ControlHeading>Play songs from your local device</ControlHeading>
          <FlexContainer>
            <Select
              value={selectedDevice}
              onChange={this.handleDeviceSelect}
              fullWidth
              style={{ marginRight: '2rem' }}
              disabled={devicesList.length === 0}
              input={<OutlinedTextField name="devices" />}
            >
              {devicesList.map((eachDevice, index) => (
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

        <Section>
          <ControlHeading>Speech To Text(STT)</ControlHeading>
          <FlexContainer>
            <FormControl>
              <RadioGroup
                aria-label="stt"
                name="stt"
                value={stt}
                onChange={this.handleRadioChange}
              >
                <FormControlLabel
                  value="google"
                  control={<Radio />}
                  label="Google"
                />
                <FormControlLabel
                  value="watson"
                  control={<Radio />}
                  label="Watson"
                />
                <FormControlLabel
                  value="bing"
                  control={<Radio />}
                  label="Bing"
                />
                <FormControlLabel
                  value="pocketsphinx"
                  control={<Radio />}
                  label="Pocket Sphinx"
                />
              </RadioGroup>
            </FormControl>
          </FlexContainer>
        </Section>
        <Section>
          <ControlHeading>Text To Speech(TTS)</ControlHeading>
          <FlexContainer>
            <FormControl>
              <RadioGroup
                aria-label="tts"
                name="tts"
                value={tts}
                onChange={this.handleRadioChange}
              >
                <FormControlLabel
                  value="google"
                  control={<Radio />}
                  label="Google"
                />
                <FormControlLabel
                  value="watson"
                  control={<Radio />}
                  label="Watson"
                />
                <FormControlLabel
                  value="flite"
                  control={<Radio />}
                  label="Flite"
                />
              </RadioGroup>
            </FormControl>
          </FlexContainer>
        </Section>
        <Section>
          <ControlHeading>Set Hotword Engine</ControlHeading>
          <FlexContainer>
            <FormControl>
              <RadioGroup
                aria-label="Hotword"
                name="hotword"
                value={hotword}
                onChange={this.handleRadioChange}
              >
                <FormControlLabel
                  value="Snowboy"
                  control={<Radio />}
                  label="Snowboy"
                />
                <FormControlLabel
                  value="PocketSphinx"
                  control={<Radio />}
                  label="Pocket Sphinx"
                />
              </RadioGroup>
            </FormControl>
          </FlexContainer>
        </Section>
        <Section>
          <ControlHeading>Wake Button</ControlHeading>
          <FlexContainer>
            <FormControl>
              <RadioGroup
                aria-label="wake-button"
                name="wake"
                value={wake}
                onChange={this.handleRadioChange}
              >
                <FormControlLabel
                  value="y"
                  control={<Radio />}
                  label="Enable"
                />
                <FormControlLabel
                  value="n"
                  control={<Radio />}
                  label="Disable"
                />
              </RadioGroup>
            </FormControl>
          </FlexContainer>
        </Section>
      </OverlayContainer>
    );
  }
}

function mapStateToProps(store) {
  return {
    isLocalEnv: store.app.isLocalEnv,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ControlSection);
