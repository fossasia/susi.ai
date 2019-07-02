import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Translate from '../Translate/Translate.react';
import settingActions from '../../redux/actions/settings';
import SettingsTabWrapper from './SettingsTabWrapper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import { FlexContainer } from '../shared/Container';
import { bindActionCreators } from 'redux';
import { setUserSettings } from '../../apis';
import uiActions from '../../redux/actions/ui';

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition ||
  window.oSpeechRecognition;

class MicrophoneTab extends React.Component {
  constructor(props) {
    super(props);
    const { micInput } = this.props;
    this.state = {
      micInput,
      loading: false,
    };
    if (SpeechRecognition !== null) {
      this.STTBrowserSupport = true;
    } else {
      this.STTBrowserSupport = false;
      console.warn(
        'The current browser does not support the SpeechRecognition API.',
      );
    }
  }

  // Handle change to mic input settings
  handleMicInput = (event, isInputChecked) => {
    this.setState({
      micInput: isInputChecked,
    });
  };

  handleSubmit = () => {
    const { actions } = this.props;
    const { micInput } = this.state;
    this.setState({ loading: true });
    setUserSettings({ micInput })
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions.setUserSettings({ micInput });
          this.setState({ loading: false });
        } else {
          actions.openSnackBar({
            snackBarMessage: 'Failed to save Settings',
          });
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: 'Failed to save Settings',
        });
      });
  };

  render() {
    const { micInput, loading } = this.state;
    const disabled = micInput === this.props.micInput || loading;
    return (
      <SettingsTabWrapper heading="Mic Input">
        <FlexContainer>
          <div>
            <Translate text="Enable mic to give voice input " />
          </div>
          <div>
            <Switch
              color="primary"
              disabled={!this.STTBrowserSupport}
              onChange={this.handleMicInput}
              checked={micInput}
            />
          </div>
        </FlexContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={disabled}
          style={{ margin: '1.5rem 0', width: '10rem' }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Translate text="Save Changes" />
          )}
        </Button>
      </SettingsTabWrapper>
    );
  }
}

MicrophoneTab.propTypes = {
  micInput: PropTypes.bool,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    micInput: store.settings.micInput,
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
)(MicrophoneTab);
