import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageStore from '../../../stores/MessageStore';
import Slider from '@material-ui/lab/Slider';
import Button from '@material-ui/core/Button';
import VoicePlayer from '../MessageListItem/VoicePlayer';
import Icon from '@material-ui/core/Icon';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Translate from '../../Translate/Translate.react';
import isMobileView from '../../../utils/isMobileView';

class TextToSpeechSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: this.props.rate,
      pitch: this.props.pitch,
      play: false,
      playExample: false,
      ttsLanguage: this.props.lang,
      voiceList: MessageStore.getTTSVoiceList(),
    };
    this.speechSynthesisExample = 'This is an example of speech synthesis';
    this.speechDemo = 'Hi! I am SUSI';
  }

  // Triggered when the voice player is started
  onStart = () => {
    this.setState({
      play: true,
    });
  };

  // Triggered when the voice player has finished
  onEnd = () => {
    this.setState({
      play: false,
      playExample: false,
    });
  };

  // Handle changes to speech rate
  handleRate = (event, value) => {
    this.setState(
      {
        rate: value,
      },
      () => this.handleSettingsChange(),
    );
  };

  // Handle changes to speech pitch
  handlePitch = (event, value) => {
    this.setState(
      {
        pitch: value,
      },
      () => this.handleSettingsChange(),
    );
  };

  // Reset speech rate to default value
  resetRate = () => {
    this.setState(
      {
        rate: 1,
      },
      () => this.handleSettingsChange(),
    );
  };

  // Reset speech pitch to default value
  resetPitch = () => {
    this.setState(
      {
        pitch: 1,
      },
      () => this.handleSettingsChange(),
    );
  };

  // Set state to play speech synthesis example
  playDemo = () => {
    this.setState({
      playExample: true,
      play: true,
    });
  };

  // save new settings to props
  handleSettingsChange = () => {
    this.props.newTtsSettings({
      speechRate: this.state.rate,
      speechPitch: this.state.pitch,
      ttsLanguage: this.state.ttsLanguage,
    });
  };

  // Generate language list drop down menu items
  populateVoiceList = () => {
    let voices = this.state.voiceList;
    let langCodes = [];
    let voiceMenu = voices.map((voice, index) => {
      if (voice.translatedText === null) {
        voice.translatedText = this.speechSynthesisExample;
      }
      langCodes.push(voice.lang);
      return (
        <MenuItem value={voice.lang} key={index}>
          {voice.name + ' (' + voice.lang + ')'}
        </MenuItem>
      );
    });
    let currLang = this.state.ttsLanguage;
    let voiceOutput = {
      voiceMenu: voiceMenu,
      voiceLang: currLang,
      voiceText: this.speechSynthesisExample,
    };
    // `-` and `_` replacement check of lang codes
    if (langCodes.indexOf(currLang) === -1) {
      if (
        currLang &&
        currLang.indexOf('-') > -1 &&
        langCodes.indexOf(currLang.replace('-', '_')) > -1
      ) {
        voiceOutput.voiceLang = currLang.replace('-', '_');
      } else if (
        currLang &&
        currLang.indexOf('_') > -1 &&
        langCodes.indexOf(currLang.replace('_', '-')) > -1
      ) {
        voiceOutput.voiceLang = currLang.replace('_', '-');
      }
    }
    // Get the translated text for TTS in selected lang
    let langCodeIndex = langCodes.indexOf(voiceOutput.voiceLang);
    if (langCodeIndex > -1) {
      voiceOutput.voiceText = voices[langCodeIndex].translatedText;
    }
    return voiceOutput;
  };

  handleTTSVoices = (event, index, value) => {
    this.setState(
      {
        ttsLanguage: value,
      },
      () => this.handleSettingsChange(),
    );
  };

  render() {
    let mobileView = isMobileView();
    let voiceOutput = this.populateVoiceList();
    return (
      <div className="settingsForm">
        <div>
          <div style={this.props.headingStyle} className="speechSettingDiv">
            <Translate text="Speech Output Language" />
          </div>
          <Select value={voiceOutput.voiceLang} onChange={this.handleTTSVoices}>
            {voiceOutput.voiceMenu}
          </Select>
        </div>
        <div>
          <div style={this.props.headingStyle}>
            <Translate text="Speech Output Rate" />
          </div>
          <Slider
            min={0.5}
            max={2}
            value={this.state.rate}
            onChange={this.handleRate}
            style={{ paddingBottom: '1.6rem', paddingTop: '1.6rem' }}
          />
          <Button variant="contained" onClick={this.resetRate}>
            <Translate text="Reset to normal" />
          </Button>
        </div>
        <div>
          <div style={this.props.headingStyle}>
            <Translate text="Speech Output Pitch" />
          </div>
          <Slider
            min={0}
            max={2}
            value={this.state.pitch}
            onChange={this.handlePitch}
            style={{ paddingBottom: '1.6rem', paddingTop: '1.6rem' }}
          />
          <Button variant="contained" onClick={this.resetPitch}>
            <Translate text="Reset to normal" />
          </Button>
        </div>

        <div style={{ textAlign: mobileView ? 'left' : 'center' }}>
          <Button
            variant="contained"
            className="settingsBtns"
            onClick={this.playDemo}
            color="secondary"
          >
            <Icon
              style={{ marginRight: '0.7rem' }}
              className="fa fa-volume-up"
            />
            <Translate text="Play Demonstration" />
          </Button>
        </div>
        {this.state.playExample && (
          <VoicePlayer
            play={this.state.play}
            text={this.speechDemo}
            rate={this.state.rate}
            pitch={this.state.pitch}
            lang={this.state.ttsLanguage}
            onStart={this.onStart}
            onEnd={this.onEnd}
          />
        )}
      </div>
    );
  }
}

TextToSpeechSettings.propTypes = {
  rate: PropTypes.number,
  pitch: PropTypes.number,
  lang: PropTypes.string,
  newTtsSettings: PropTypes.func,
  themeVal: PropTypes.string,
  themeForegroundColor: PropTypes.string,
  headingStyle: PropTypes.object,
};

export default TextToSpeechSettings;
