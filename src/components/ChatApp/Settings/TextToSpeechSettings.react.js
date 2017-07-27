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

	onStart = () => {
		this.setState({
			play: true
		});
	}

	onEnd = () => {
		this.setState({
			play: false,
			playExample: false,
		});
	}

	handleRate = (event, value) => {
		this.setState({
			rate: value,
		});
	};

	handlePitch = (event, value) => {
		this.setState({
			pitch: value,
		});
	};

	resetRate = () => {
		this.setState({
			rate: 1,
		});
	}

	resetPitch = () => {
		this.setState({
			pitch: 1,
		});
	}

	playDemo = () => {
		this.setState({
			playExample: true,
			play:true,
		});
	}

	handleSubmit = () => {
		this.props.ttsSettings({
			rate: this.state.rate,
			pitch: this.state.pitch,
			lang: this.state.ttsLanguage,
		});
	}

	populateVoiceList = () => {
		let voices = this.state.voiceList;
		let voiceMenu = voices.map((voice,index) => {
			return(
					<MenuItem value={voice.lang} key={index}
						primaryText={voice.name+' ('+voice.lang+')'} />
			);
		});
		return voiceMenu;
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

		let voiceList = this.populateVoiceList();

		return (
			<div className="settingsForm">
				<Paper zDepth={0}>
					<h3 style={{textAlign: 'center'}}>Text-To-Speech Settings</h3>
					<h4 style={subHeaderStyle}>General</h4>
							<div>
								<h4 style={{'marginBottom':'0px'}}>Language</h4>
								<DropDownMenu
									value={this.state.ttsLanguage}
									onChange={this.handleTTSVoices}>
								 {voiceList}
							 </DropDownMenu>
							</div>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Speech Rate</h4>
			        	<Slider
			        		min={0.1}
			        		max={5}
			        		value={this.state.rate}
			        		onChange={this.handleRate} />
			        </div>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Pitch</h4>
			        	<Slider
			        		min={0}
			        		max={2}
			        		value={this.state.pitch}
			        		onChange={this.handlePitch} />
			        </div>
			        <div>
			    		<h4 style={{'marginBottom':'0px'}}>Reset Speech Rate</h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label="Reset the speed at which the text is spoken to normal"
							onClick={this.resetRate} />
			    	</div>
			    	<div>
			    		<h4 style={{'marginBottom':'0px'}}>Reset Speech Pitch</h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label="Reset the pitch at which the text is spoken to default"
							onClick={this.resetPitch} />
			    	</div>
			    	<div>
			    		<h4 style={{'marginBottom':'0px'}}>Listen to an example</h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label="Play a short demonstration of speech synthesis"
							onClick={this.playDemo} />
			    	</div>
			    	<div style={{textAlign: 'center'}}>
						<RaisedButton
							label="Save"
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
	                  text={this.speechSynthesisExample}
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
