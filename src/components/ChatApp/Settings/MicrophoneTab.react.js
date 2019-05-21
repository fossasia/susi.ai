import React from 'react';
import Translate from '../../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import { FlexContainer } from '../../Commons/Container';

const MicrophoneTab = props => {
  let STTBrowserSupport;
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition;

  if (SpeechRecognition != null) {
    STTBrowserSupport = true;
  } else {
    STTBrowserSupport = false;
    console.warn(
      'The current browser does not support the SpeechRecognition API.',
    );
  }
  return (
    <SettingsTabWrapper heading="Mic Input" theme={props.themeVal}>
      <FlexContainer>
        <div className="reduceSettingDiv">
          <Translate text="Enable mic to give voice input " />
        </div>
        <div>
          <Switch
            color="primary"
            disabled={!STTBrowserSupport}
            onChange={props.handleMicInput}
            checked={props.micInput}
          />
        </div>
      </FlexContainer>
    </SettingsTabWrapper>
  );
};

MicrophoneTab.propTypes = {
  containerStyle: PropTypes.object,
  handleMicInput: PropTypes.func,
  micInput: PropTypes.bool,
  themeForegroundColor: PropTypes.string,
  themeVal: PropTypes.string,
  tabHeadingStyle: PropTypes.object,
};

export default MicrophoneTab;
