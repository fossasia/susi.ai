import React from 'react';
import Translate from '../../Translate/Translate.react';
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
    <div style={props.containerStyle}>
      <div>
        <div>
          <div style={props.tabHeadingStyle}>
            <Translate text="Mic Input" />
          </div>
          {props.themeVal === 'light' ? (
            <hr className="break-line-light" style={{ height: '2px' }} />
          ) : (
            <hr className="break-line-dark" />
          )}
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
        </div>
      </div>
    </div>
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
