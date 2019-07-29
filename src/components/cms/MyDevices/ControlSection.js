import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  };

  state = {
    volume: 50,
    youtubeLink: '',
    devicesList: [],
    selectedDevice: '',
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

  render() {
    const { volume, youtubeLink, devicesList, selectedDevice } = this.state;
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
      </OverlayContainer>
    );
  }
}

function mapStateToProps(store) {
  return {
    isLocalEnv: store.app.isLocalEnv,
  };
}

export default connect(
  mapStateToProps,
  null,
)(ControlSection);
