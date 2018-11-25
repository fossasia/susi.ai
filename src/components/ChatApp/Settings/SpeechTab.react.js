import React from 'react';
import Translate from '../../Translate/Translate.react';
import PropTypes from 'prop-types';
import TextToSpeechSettings from './TextToSpeechSettings.react';
import Toggle from 'material-ui/Toggle';

const SpeechTab = props => {
  let TTSBrowserSupport;
  if ('speechSynthesis' in window) {
    TTSBrowserSupport = true;
  } else {
    TTSBrowserSupport = false;
    console.warn(
      'The current browser does not support the SpeechSynthesis API.',
    );
  }
  return (
    <div style={props.containerStyle}>
      <div>
        <div
          style={{
            marginTop: '10px',
            marginBottom: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          <Translate text="Speech Output" />
        </div>
        {props.themeVal === 'light' ? (
          <hr className="break-line-light" style={{ height: '2px' }} />
        ) : (
          <hr className="break-line-dark" />
        )}
        <br />
        <div
          style={{
            float: 'left',
            padding: '0px 5px 0px 0px',
          }}
          className="reduceSettingDiv"
        >
          <Translate text="Enable speech output only for speech input" />
        </div>
        <Toggle
          className="settings-toggle"
          disabled={!TTSBrowserSupport}
          labelStyle={{ color: props.themeForegroundColor }}
          onToggle={props.handleSpeechOutput}
          toggled={props.speechOutput}
        />
        <br />
        <br />
      </div>
      <div>
        <div
          style={{
            marginTop: '10px',
            marginBottom: '0px',
            fontSize: '15px',
            fontWeight: 'bold',
          }}
          className="reduceSettingDiv"
        >
          <Translate text="Speech Output Always ON" />
        </div>
        <br />
        <div
          style={{
            float: 'left',
            padding: '5px 5px 0px 0px',
          }}
          className="reduceSettingDiv"
        >
          <Translate text="Enable speech output regardless of input type" />
        </div>
        <Toggle
          className="settings-toggle"
          disabled={!TTSBrowserSupport}
          labelStyle={{ color: props.themeForegroundColor }}
          onToggle={props.handleSpeechOutputAlways}
          toggled={props.speechOutputAlways}
        />
        <br />
        <br />
      </div>
      <div>
        <TextToSpeechSettings
          rate={props.speechRate}
          pitch={props.speechPitch}
          lang={props.ttsLanguage}
          newTtsSettings={props.handleNewTextToSpeech.bind(this)}
        />
      </div>
    </div>
  );
};

SpeechTab.propTypes = {
  containerStyle: PropTypes.object,
  handleNewTextToSpeech: PropTypes.func,
  handleSpeechOutput: PropTypes.func,
  handleSpeechOutputAlways: PropTypes.func,
  speechOutput: PropTypes.bool,
  speechOutputAlways: PropTypes.bool,
  speechPitch: PropTypes.number,
  speechRate: PropTypes.number,
  themeForegroundColor: PropTypes.string,
  themeVal: PropTypes.string,
  ttsLanguage: PropTypes.string,
};

export default SpeechTab;
