import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Translate from '../../Translate/Translate.react';
import settingActions from '../../../redux/actions/settings';
import SettingsTabWrapper from './SettingsTabWrapper';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import { FlexContainer } from '../../shared/Container';
import { bindActionCreators } from 'redux';
import { setUserSettings } from '../../../apis';
import uiActions from '../../../redux/actions/ui';

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
    setUserSettings({ micInput })
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions.setUserSettings({ micInput });
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
    const { micInput } = this.state;
    return (
      <SettingsTabWrapper heading="Mic Input">
        <FlexContainer>
          <div className="reduceSettingDiv">
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
          disabled={micInput === this.props.micInput}
        >
          <Translate text="Save Changes" />
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
