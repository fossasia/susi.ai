import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Cookies from 'universal-cookie';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import TextToSpeechSettings from './TextToSpeechSettings.react';
import Close from 'material-ui/svg-icons/navigation/close';

const cookies = new Cookies();

class Settings extends Component {

	constructor(props) {
		super(props);
		let defaults = UserPreferencesStore.getPreferences();
		let defaultServer = defaults.Server;
		let defaultTheme = defaults.Theme;
		let defaultEnterAsSend = defaults.EnterAsSend;
		let defaultMicInput = defaults.MicInput;
		let defaultSpeechOutput = defaults.SpeechOutput;
		let defaultSpeechOutputAlways = defaults.SpeechOutputAlways;
		let defaultSpeechRate = defaults.SpeechRate;
		let defaultSpeechPitch = defaults.SpeechPitch;
		this.state = {
			theme: defaultTheme,
			enterAsSend: defaultEnterAsSend,
			micInput: defaultMicInput,
			speechOutput: defaultSpeechOutput,
			speechOutputAlways: defaultSpeechOutputAlways,
			server: defaultServer,
			serverUrl: '',
            serverFieldError: false,
            checked: false,
			validForm: true,
			showLanguageSettings: false,
			speechRate: defaultSpeechRate,
			speechPitch: defaultSpeechPitch,
		};

		this.customServerMessage = '';
	}

	handleServer = () => {
		this.props.onServerChange();
	}

	handleHardware = () => {
		this.props.onHardwareSettings();
	}
	handleClose = ()  => {
		this.setState({
			showLanguageSettings: false
		})
	}
	handleSubmit = () => {
		let newTheme = this.state.theme;
		let newDefaultServer = this.state.server;
		let newEnterAsSend = this.state.enterAsSend;
		let newMicInput = this.state.micInput;
		let newSpeechOutput = this.state.speechOutput;
		let newSpeechOutputAlways = this.state.speechOutputAlways;
		let newSpeechRate = this.state.speechRate;
		let newSpeechPitch = this.state.speechPitch;
		if(newDefaultServer.slice(-1)==='/'){
			newDefaultServer = newDefaultServer.slice(0,-1);
		}
		let vals = {
			theme: newTheme,
			server: newDefaultServer,
			enterAsSend: newEnterAsSend,
			micInput: newMicInput,
			speechOutput: newSpeechOutput,
			speechOutputAlways: newSpeechOutputAlways,
			rate: newSpeechRate,
			pitch: newSpeechPitch,
		}

		let settings = Object.assign({}, vals);
		settings.LocalStorage = true;
		// Store in cookies for anonymous user
		cookies.set('settings',settings);

		this.props.onSettingsSubmit(vals);
	}

	handleSelectChange= (event, index, value) => {
		this.setState({theme:value});
	}

	handleEnterAsSend = (event, isInputChecked) => {
		this.setState({
			enterAsSend: isInputChecked,
		});
	}

	handleMicInput = (event, isInputChecked) => {
		this.setState({
			micInput: isInputChecked,
		});
	}

	handleSpeechOutput = (event, isInputChecked) => {
		this.setState({
			speechOutput: isInputChecked,
		});
	}

	handleSpeechOutputAlways = (event, isInputChecked) => {
		this.setState({
			speechOutputAlways: isInputChecked,
		});
	}

	handleLanguage = (toShow) => {
		this.setState({
			showLanguageSettings: toShow,
		});
	}

	handleTextToSpeech = (settings) => {
		this.setState({
			speechRate: settings.rate,
			speechPitch: settings.pitch,
			showLanguageSettings: false,
		});
	}

	handleChange = (event) => {
        let state = this.state;
        let serverUrl;
        if (event.target.value === 'customServer') {
        	state.checked = true;
        	state.serverFieldError = true;
        }
		else if (event.target.value === 'standardServer') {
			state.checked = false;
			state.serverFieldError = false;
			let defaults = UserPreferencesStore.getPreferences();
			let standardServerURL = defaults.StandardServer;
			state.server = standardServerURL;
		}
		else if (event.target.name === 'serverUrl'){
        	serverUrl = event.target.value;
        	let validServerUrl =
/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i
        	.test(serverUrl);
			state.server = serverUrl;
			state.serverFieldError = !(serverUrl && validServerUrl);
        }

        if (state.serverFieldError) {
        	this.customServerMessage = 'Enter a valid URL';
        }
        else{
        	this.customServerMessage = '';
        }

    	if (!state.serverFieldError || !state.checked)
    	{
    		state.validForm = true;
    	}
        else {
        	state.validForm = false;
        }
		this.setState(state);
	};

	render() {

		const Buttonstyles = {
			marginBottom: 16,
		}

		const subHeaderStyle = {
			color: UserPreferencesStore.getTheme()==='light'
								? '#4285f4' : '#19314B',
			margin: '20px 0 0 0',
			fontSize: '15px'
		}
		const closingStyle ={
          position: 'absolute',
          zIndex: 1200,
          fill: '#444',
          width: '26px',
          height: '26px',
          right: '10px',
          top: '10px',
          cursor:'pointer'
        }
		const radioButtonStyles = {
		  block: {
		    maxWidth: 250,
		  },
		  radioButton: {
		    marginBottom: 16,
		  },
		};

		const serverURL = <TextField name="serverUrl"
							onChange={this.handleChange}
							errorText={this.customServerMessage}
							floatingLabelText="Custom URL" />;
		const hidden = this.state.checked ? serverURL : '';

		return (
			<div className="settingsForm">
				<Paper zDepth={0}>
					<h3 className='headerStyle'>Chat Settings</h3>
					<div className='settingsDialog'>
					<h3 style={subHeaderStyle}>ChatApp Settings</h3>
					<div>
						<h4 style={{float:'left'}}>Select Theme</h4>
						<DropDownMenu
							label='Default Theme'
							value={this.state.theme}
							onChange={this.handleSelectChange}>
				          <MenuItem value={'light'} primaryText="Light" />
				          <MenuItem value={'dark'} primaryText="Dark" />
				        </DropDownMenu>
			        </div>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Enter As Send</h4>
			        	<Toggle style={{maxWidth:'70%'}}
			        		label='Send message by pressing ENTER'
			        		onToggle={this.handleEnterAsSend}
							toggled={this.state.enterAsSend}/>
			        </div>
			        <h3 style={subHeaderStyle}>Mic Settings</h3>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Mic Input</h4>
			        	<Toggle style={{maxWidth:'70%'}}
			        		label='Enable mic to give voice input'
			        		onToggle={this.handleMicInput}
							toggled={this.state.micInput}/>
			        </div>
			        <h3 style={subHeaderStyle}>Speech Settings</h3>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Speech Output</h4>
			        	<Toggle style={{maxWidth:'70%'}}
			        		label='Enable speech output only for speech input'
			        		onToggle={this.handleSpeechOutput}
							toggled={this.state.speechOutput}/>
			        </div>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Speech Output Always ON</h4>
			        	<Toggle style={{maxWidth:'70%'}}
			        		label='Enable speech output regardless of input type'
			        		onToggle={this.handleSpeechOutputAlways}
							toggled={this.state.speechOutputAlways}/>
			        </div>
			        <div>
			    		<h4 style={{'marginBottom':'0px'}}>Language</h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label="Select a Language"
							onClick={this.handleLanguage.bind(this,true)} />
			    	</div>
			        {cookies.get('loggedIn') ?
			        <div>
			        <h3 style={subHeaderStyle}>Server Settings</h3>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label="Select backend server for the app"
							onClick={this.handleServer} />

			    	</div>
			       	:
					<div>
						<h3 style={subHeaderStyle}>Server Settings</h3>
						<h3>Choose Server</h3>
						<RadioButtonGroup
						 name="server" onChange={this.handleChange}
						 defaultSelected="standardServer">
						<RadioButton
						       value="customServer"
						       label="Custom Server"
						       labelPosition="left"
						       style={radioButtonStyles.radioButton}
						     />
						<RadioButton
						       value="standardServer"
						       label="Standard Server"
						       labelPosition="left"
						       style={radioButtonStyles.radioButton}
						     />
						</RadioButtonGroup>
						{hidden}
					</div>
					}
			    	<div>
			    	<h3 style={subHeaderStyle}>Connect to SUSI Hardware:</h3>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label="Add address to connect to Hardware"
							onClick={this.handleHardware} />
			    	</div>
			    	</div>
			    	<div>
						<RaisedButton
							label="Save"
							disabled={!this.state.validForm}
							backgroundColor={
								UserPreferencesStore.getTheme()==='light'
								? '#4285f4' : '#19314B'}
							labelColor="#fff"
							onClick={this.handleSubmit}
						/>
					</div>
				</Paper>
				<Dialog
		          modal={false}
		          autoScrollBodyContent={true}
		          open={this.state.showLanguageSettings}
		          onRequestClose={this.handleLanguage.bind(this,false)}>
		          <TextToSpeechSettings
		          	rate={this.state.speechRate}
		          	pitch={this.state.speechPitch}
		          	ratePitchSettings={this.handleTextToSpeech}/>
		          <Close style={closingStyle} onTouchTap={this.handleClose} />
		        </Dialog>
			</div>);
	}
}

Settings.propTypes = {
	history: PropTypes.object,
	onSettingsSubmit: PropTypes.func,
	onServerChange: PropTypes.func,
	onHardwareSettings: PropTypes.func
};

export default Settings;
