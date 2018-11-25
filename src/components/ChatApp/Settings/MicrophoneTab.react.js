import React from 'react';
import Translate from '../../Translate/Translate.react';
import Toggle from 'material-ui/Toggle';
import PropTypes from 'prop-types';

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
          <div
            style={{
              marginTop: '10px',
              marginBottom: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="Mic Input" />
          </div>
          {props.themeVal === 'light' ? (
            <hr className="break-line-light" style={{ height: '2px' }} />
          ) : (
            <hr className="break-line-dark" />
          )}
          <br />
          <div
            className="reduceSettingDiv"
            style={{
              float: 'left',
              padding: '0px 5px 0px 0px',
            }}
          >
            <Translate text="Enable mic to give voice input " />
          </div>
          <Toggle
            className="settings-toggle"
            labelStyle={{ color: props.themeForegroundColor }}
            disabled={!STTBrowserSupport}
            onToggle={props.handleMicInput}
            toggled={props.micInput}
          />
          <br />
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
};

export default MicrophoneTab;
