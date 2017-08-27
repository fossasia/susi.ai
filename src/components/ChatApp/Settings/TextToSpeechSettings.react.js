import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import MessageStore from '../../../stores/MessageStore';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import VoicePlayer from '../MessageListItem/VoicePlayer';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Translate from '../../Translate/Translate.react';

class TextToSpeechSettings extends Component {

	constructor(props) {
		super(props);
		this.state = {
			rate: this.props.rate,
			pitch: this.props.pitch,
			play: false,
			playExample:false,
			ttsLanguage: this.props.lang,
			voiceList: MessageStore.getTTSVoiceList(),
		};
		this.speechSynthesisExample = 'This is an example of speech synthesis';
	}

	// Triggered when the voice player is started
	onStart = () => {
		this.setState({
			play: true
		});
	}

	// Triggered when the voice player has finished
	onEnd = () => {
		this.setState({
			play: false,
			playExample: false,
		});
	}

	// Handle changes to speech rate
	handleRate = (event, value) => {
		this.setState({
			rate: value,
		});
	};

	// Handle changes to speech pitch
	handlePitch = (event, value) => {
		this.setState({
			pitch: value,
		});
	};

	// Reset speech rate to default value
	resetRate = () => {
		this.setState({
			rate: 1,
		});
	}

	// Reset speech pitch to default value
	resetPitch = () => {
		this.setState({
			pitch: 1,
		});
	}

	// Set state to play speech synthesis example
	playDemo = () => {
		this.setState({
			playExample: true,
			play:true,
		});
	}

	// Submit TTS settings to parent settings component
	handleSubmit = () => {
		this.props.ttsSettings({
			rate: this.state.rate,
			pitch: this.state.pitch,
			lang: this.state.ttsLanguage,
		});
	}

	// Generate language list drop down menu items
	populateVoiceList = () => {
		let voices = this.state.voiceList;
		let langCodes = [];
		let voiceMenu = voices.map((voice,index) => {
			if(voice.translatedText === null){
				voice.translatedText = this.speechSynthesisExample;
			}
			langCodes.push(voice.lang);
			return(
					<MenuItem value={voice.lang} key={index}
						primaryText={voice.name+' ('+voice.lang+')'} />
			);
		});
		let currLang = this.state.ttsLanguage;
		let voiceOutput = {
			voiceMenu: voiceMenu,
			voiceLang: currLang,
			voiceText: this.speechSynthesisExample,
		}
		// `-` and `_` replacement check of lang codes
		if(langCodes.indexOf(currLang) === -1){
			if(currLang.indexOf('-') > -1 && langCodes.indexOf(currLang.replace('-','_')) > -1){
				voiceOutput.voiceLang = currLang.replace('-','_');
			}
			else if(currLang.indexOf('_') > -1 && langCodes.indexOf(currLang.replace('_','-')) > -1){
				voiceOutput.voiceLang = currLang.replace('_','-');
			}
		}
		// Get the translated text for TTS in selected lang
		let langCodeIndex = langCodes.indexOf(voiceOutput.voiceLang);
		if( langCodeIndex > -1){
			voiceOutput.voiceText = voices[langCodeIndex].translatedText;
		}
		return voiceOutput;
	}

	handleTTSVoices = (event, index, value) => {
		this.setState({
			ttsLanguage: value,
		});
	}

	render() {

		const Buttonstyles = {
			marginBottom: 16,
		}

		const subHeaderStyle = {
			color: UserPreferencesStore.getTheme()==='light'
								? '#4285f4' : '#19314B'
		}

		let voiceOutput = this.populateVoiceList();

		return (
			<div className="settingsForm">
				<Paper zDepth={0}>
					<h3 style={{textAlign: 'center'}}><Translate text="Text-To-Speech Settings"/></h3>
					<h4 style={subHeaderStyle}><Translate text="General"/></h4>
							<div>
								<h4 style={{'marginBottom':'0px'}}><Translate text="Language"/></h4>
								<DropDownMenu
									value={voiceOutput.voiceLang}
									onChange={this.handleTTSVoices}>
								 {voiceOutput.voiceMenu}
							 </DropDownMenu>
							</div>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}><Translate text="Speech Rate"/></h4>
			        	<Slider
			        		min={0.5}
			        		max={2}
			        		value={this.state.rate}
			        		onChange={this.handleRate} />
			        </div>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}><Translate text="Speech Pitch"/></h4>
			        	<Slider
			        		min={0}
			        		max={2}
			        		value={this.state.pitch}
			        		onChange={this.handlePitch} />
			        </div>
			        <div>
			    		<h4 style={{'marginBottom':'0px'}}><Translate text="Reset Speech Rate"/></h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label={<Translate text="Reset the speed at which the text is spoken to normal"/>}
							onClick={this.resetRate} />
			    	</div>
			    	<div>
			    		<h4 style={{'marginBottom':'0px'}}><Translate text="Reset Speech Pitch"/></h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label={<Translate text="Reset the pitch at which the text is spoken to default"/>}
							onClick={this.resetPitch} />
			    	</div>
			    	<div>
			    		<h4 style={{'marginBottom':'0px'}}><Translate text="Listen to an example"/></h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label={<Translate text="Play a short demonstration of speech synthesis"/>}
							onClick={this.playDemo} />
			    	</div>
			    	<div style={{textAlign: 'center'}}>
						<RaisedButton
							label={<Translate text="Save"/>}
							backgroundColor={
								UserPreferencesStore.getTheme()==='light'
								? '#4285f4' : '#19314B'}
							labelColor="#fff"
							onClick={this.handleSubmit}
						/>
					</div>
				</Paper>
				{ this.state.playExample &&
	               (<VoicePlayer
	                  play={this.state.play}
	                  text={voiceOutput.voiceText}
	                  rate={this.state.rate}
	                  pitch={this.state.pitch}
										lang={this.state.ttsLanguage}
	                  onStart={this.onStart}
	                  onEnd={this.onEnd}
	                />)
	           }
			</div>);
	}
}

TextToSpeechSettings.propTypes = {
	rate: PropTypes.number,
	pitch: PropTypes.number,
	lang: PropTypes.string,
	ttsSettings: PropTypes.func,
};

export default TextToSpeechSettings;
