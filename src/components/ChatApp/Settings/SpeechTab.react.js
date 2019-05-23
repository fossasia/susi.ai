import React from 'react';
import Translate from '../../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import PropTypes from 'prop-types';
import TextToSpeechSettings from './TextToSpeechSettings.react';
import Switch from '@material-ui/core/Switch';
import { FlexContainer } from '../../shared/Container';

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
    <SettingsTabWrapper heading="Speech Output" theme={props.themeVal}>
      <FlexContainer>
        <div>
          <Translate text="Enable speech output only for speech input" />
        </div>
        <div>
          <Switch
            color="primary"
            disabled={!TTSBrowserSupport}
            onChange={props.handleSpeechOutput}
            checked={props.speechOutput}
          />
        </div>
      </FlexContainer>
      <div>
        <div style={props.headingStyle} className="reduceSettingDiv">
          <Translate text="Speech Output Always ON" />
        </div>
        <FlexContainer>
          <div>
            <Translate text="Enable speech output regardless of input type" />
          </div>
          <div>
            <Switch
              color="primary"
              disabled={!TTSBrowserSupport}
              onChange={props.handleSpeechOutputAlways}
              checked={props.speechOutputAlways}
            />
          </div>
        </FlexContainer>
      </div>
      <div>
        <TextToSpeechSettings
          rate={props.speechRate}
          pitch={props.speechPitch}
          lang={props.ttsLanguage}
          newTtsSettings={props.handleNewTextToSpeech.bind(this)}
          themeForegroundColor={props.themeForegroundColor}
          themeVal={props.themeVal}
          headingStyle={props.headingStyle}
        />
      </div>
    </SettingsTabWrapper>
  );
};

SpeechTab.propTypes = {
  containerStyle: PropTypes.object,
  headingStyle: PropTypes.object,
  tabHeadingStyle: PropTypes.object,
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
