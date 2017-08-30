import './Settings.css';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import MessageStore from '../../../stores/MessageStore';
import Cookies from 'universal-cookie';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import TextToSpeechSettings from './TextToSpeechSettings.react';
import Close from 'material-ui/svg-icons/navigation/close';
import HardwareComponent from '../HardwareComponent';
import CustomServer from '../CustomServer.react';
import ChangePassword from '../../Auth/ChangePassword/ChangePassword.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import './Settings.css';
import Translate from '../../Translate/Translate.react';
import StaticAppBar from '../../StaticAppBar/StaticAppBar.react';
import * as Actions from '../../../actions/';
import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';


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
		let defaultTTSLanguage = defaults.TTSLanguage;
		let defaultPrefLanguage = defaults.PrefLanguage;
    	let TTSBrowserSupport;
    if ('speechSynthesis' in window) {
      TTSBrowserSupport = true;
    } else {
      TTSBrowserSupport = false;
      console.warn('The current browser does not support the SpeechSynthesis API.')
    }
    let STTBrowserSupport;
    const SpeechRecognition = window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition
      || window.oSpeechRecognition

    if (SpeechRecognition != null) {
      STTBrowserSupport = true;
    } else {
      STTBrowserSupport = false;
      console.warn('The current browser does not support the SpeechRecognition API.');
    }
    console.log(STTBrowserSupport);

		this.state = {
			theme: defaultTheme,
			selectedSetting: '',
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
			ttsLanguage: defaultTTSLanguage,
			PrefLanguage: defaultPrefLanguage,
			showServerChangeDialog: false,
			showHardwareChangeDialog: false,
			showChangePasswordDialog: false,
			showLogin: false,
      showSignUp: false,
			showForgotPassword: false,
			showOptions: false,
			anchorEl: null,
			slideIndex: 0,
			voiceList: [{
			lang: 'de-DE',
			name: 'Deutsch'
		},{
			lang:'en-US',
			name:'US English'
		}]
		}
		console.log(defaultPrefLanguage);
    this.customServerMessage = '';
    this.TTSBrowserSupport = TTSBrowserSupport;
    this.STTBrowserSupport = STTBrowserSupport;
  }

	// Show change server dialog
	handleServer = () => {
		this.setState({
			showServerChangeDialog: true
		});
	}

	// Show change password dialog
	handleChangePassword = () => {
		this.setState({
			showChangePasswordDialog: true,
		});
	}

	// Show hardware connect dialog
	handleHardware = () => {
		this.setState({
			showHardwareChangeDialog: true
		});
	}

	// Close all open dialogs
	handleClose = ()  => {
		this.setState({
			showLanguageSettings: false,
			showServerChangeDialog: false,
			showHardwareChangeDialog: false,
			showChangePasswordDialog: false,
			showOptions: false,
			showLogin: false,
			showSignUp: false,
			showForgotPassword: false,
		})
	}

	// Submit selected Settings
	handleSubmit = () => {
		let newTheme = this.state.theme;
		let newDefaultServer = this.state.server;
		let newEnterAsSend = this.state.enterAsSend;
		let newMicInput = this.state.micInput;
		let newSpeechOutput = this.state.speechOutput;
		let newSpeechOutputAlways = this.state.speechOutputAlways;
		let newSpeechRate = this.state.speechRate;
		let newSpeechPitch = this.state.speechPitch;
		let newTTSLanguage = this.state.ttsLanguage;
		let newPrefLanguage = this.state.PrefLanguage;
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
			speechRate: newSpeechRate,
			speechPitch: newSpeechPitch,
			ttsLanguage: newTTSLanguage,
			prefLanguage: newPrefLanguage
		}
		console.log(newPrefLanguage);

		let settings = Object.assign({}, vals);
		settings.LocalStorage = true;
		// Store in cookies for anonymous user
		cookies.set('settings',settings);
		console.log(settings);
		// Trigger Actions to save the settings in stores and server
		this.implementSettings(vals);
	}

	// Store the settings in stores and server
	implementSettings = (values) => {
		console.log(values);
    let currSettings = UserPreferencesStore.getPreferences();
    let resetVoice = false;
    if(currSettings.SpeechOutput !== values.speechOutput){
      resetVoice = true;
    }
    if(currSettings.SpeechOutputAlways !== values.speechOutputAlways){
      resetVoice = true;
    }
    Actions.settingsChanged(values);
    if(resetVoice){
      Actions.resetVoice();
    }
    this.props.history.push('/');
    window.location.reload();
  }

	// Handle change to theme settings
	handleSelectChange= (event, index, value) => {
		this.setState({theme:value});
	}

	// Handle change to enter as send settings
	handleEnterAsSend = (event, isInputChecked) => {
		this.setState({
			enterAsSend: isInputChecked,
		});
	}

	// Handle change to mic input settings
	handleMicInput = (event, isInputChecked) => {
		this.setState({
			micInput: isInputChecked,
		});
	}

	// Handle change to speech output on speech input settings
	handleSpeechOutput = (event, isInputChecked) => {
		this.setState({
			speechOutput: isInputChecked,
		});
	}

	// Handle change to speech output always settings
	handleSpeechOutputAlways = (event, isInputChecked) => {
		this.setState({
			speechOutputAlways: isInputChecked,
		});
	}

	// Handle change to language settings
	handleLanguage = (toShow) => {
		this.setState({
			showLanguageSettings: toShow,
		});
	}

	// Handle change to TTS settings
	handleTextToSpeech = (settings) => {
		this.setState({
			speechRate: settings.rate,
			speechPitch: settings.pitch,
			ttsLanguage: settings.lang,
			showLanguageSettings: false,
		});
	}

	// Handle toggle between default server and custom server
	handleServeChange=(event)=>{
        let state = this.state;
        let serverUrl
        if (event.target.value === 'customServer') {
            state.checked = !state.checked;
            let defaults = UserPreferencesStore.getPreferences();
            state.serverUrl = defaults.StandardServer;
            state.serverFieldError = false;
        }
        else if (event.target.name === 'serverUrl'){
            serverUrl = event.target.value;
            let validServerUrl =
/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i
            .test(serverUrl);
            state.serverUrl = serverUrl;
            state.serverFieldError = !(serverUrl && validServerUrl);
        }
        this.setState(state);

        if (this.state.serverFieldError) {
            this.customServerMessage = 'Enter a valid URL';
        }
        else{
            this.customServerMessage = '';
        }

        if(this.state.serverFieldError && this.state.checked){
            this.setState({validForm: false});
        }
        else{
            this.setState({validForm: true});
        }
    }

	handleServerToggle = (changeServer) => {
    if(changeServer){
      // Logout the user and show the login screen again
      this.props.history.push('/logout');
      this.setState({
        showLogin:true
      });
    }
    else{
      // Go back to settings dialog
      this.setState({
        showServerChangeDialog: false,
        showHardwareChangeDialog: false
      });
    }
  }

	// Close settings and redirect to landing page
	onRequestClose = () => {
		this.props.history.push('/');
    window.location.reload();
	}

	// Open Login dialog
	handleLogin = () => {
    this.setState({
      showLogin: true,
      showSignUp: false,
			showForgotPassword: false,
			showOptions: false,
    });
  }

	// Open SignUp dialog
  handleSignUp = () => {
    this.setState({
      showSignUp: true,
      showLogin: false,
			showForgotPassword: false,
			showOptions: false,
    });
  }

	// Open Forgot Password dialog
	handleForgotPassword = () => {
		this.setState({
			showForgotPassword: true,
			showLogin: false,
			showOptions: false,
		});
	}

	// Show Top Bar drop down menu
	showOptions = (event) => {
		this.setState({
      showOptions: true,
			anchorEl: event.currentTarget,
    });
	}

	handlePrefLang = (event, index, value) => {
		this.setState({
			PrefLanguage: value,
		});
	}

	// Close Top Bar drop down menu
	closeOptions = () => {
		this.setState({
      showOptions: false,
    });
	}

	componentWillMount() {
		document.body.className = 'white-body';
	}

	componentWillUnmount() {
		MessageStore.removeChangeListener(this._onChange.bind(this));
	}

	// Populate language list
	_onChange() {
		this.setState({
			voiceList: [{
				lang: 'de-DE',
				name: 'Deutsch'
			},{
				lang:'en-US',
				name:'US English'
			}]
		});
	}

	componentDidMount() {
		MessageStore.addChangeListener(this._onChange.bind(this));

		this.setState({
			search: false,
		});
		this.showWhenLoggedIn='none';
	}

	// Generate language list drop down menu items
	populateVoiceList = () => {
		let voices = this.state.voiceList;
		let langCodes = [];
		let voiceMenu = voices.map((voice,index) => {
			langCodes.push(voice.lang);
			return(
					<MenuItem value={voice.lang} key={index}
						primaryText={voice.name+' ('+voice.lang+')'} />
			);
		});
		let currLang = this.state.PrefLanguage;
		let voiceOutput = {
			voiceMenu: voiceMenu,
			voiceLang: currLang
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
		return voiceOutput;
	}

	loadSettings = (e) => {
		this.setState({selectedSetting: e.target.innerText})
	}

	render() {

		const bodyStyle = {
      'padding': 0,
      textAlign: 'center'
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

		const serverDialogActions = [
    <RaisedButton
      key={'Cancel'}
      label={<Translate text="Cancel"/>}
      backgroundColor={
        UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={false}
      onTouchTap={this.handleServerToggle.bind(this,false)}
      style={{margin: '6px'}}
    />,
    <RaisedButton
      key={'OK'}
      label={<Translate text="OK"/>}
      backgroundColor={
        UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={false}
      onTouchTap={this.handleServerToggle.bind(this,true)}
    />];

		const Buttonstyles = {
			marginBottom: 16,
		}

		const divStyle = {
			textAlign: 'center',
			padding: 20,
		}

		let currentSetting;

		let voiceOutput = this.populateVoiceList();

		if(this.state.selectedSetting === 'Server Settings') {
			currentSetting = (
				<div style={divStyle}>
						<div style={{
							marginTop: '10px',
							'marginBottom':'0px',
							fontSize: '15px',
							fontWeight: 'bold'}}>
							<Translate text="Select Server"/>
						</div>
						<CustomServer
							checked={this.state.checked}
							serverUrl={this.state.serverUrl}
							customServerMessage={this.customServerMessage}
							onServerChange={this.handleServeChange}/>
				</div>
			)

			if(cookies.get('loggedIn')) {
				currentSetting = (
					<div style={divStyle}>
						<div>
							<div style={{
								marginTop: '10px',
								'marginBottom':'0px',
								fontSize: '15px',
								fontWeight: 'bold'}}>
								<Translate text="Select Server"/>
							</div>
								<FlatButton
									className='settingsBtns'
									style={Buttonstyles}
									label={<Translate text="Select backend server for the app"/>}
									onClick={this.handleServer} />
						</div>
					</div>
				)
			}
		}

		else if(this.state.selectedSetting === 'Mic Settings') {
			currentSetting = '';
			currentSetting = (
				<div style={divStyle}>
					<div>
						<div>
							<div style={{
								marginTop: '10px',
								'marginBottom':'0px',
								fontSize: '15px',
								fontWeight: 'bold'}}>
								<Translate text="Mic Input"/>
							</div>
							<Toggle
								className='settings-toggle'
								label={<Translate text="Enable mic to give voice input"/>}
								disabled={!this.STTBrowserSupport}
								onToggle={this.handleMicInput}
								toggled={this.state.micInput}/>
						</div>
					</div>
				</div>
			)
		}

		else if(this.state.selectedSetting === 'Speech Settings') {
			currentSetting = (
				<div style={divStyle}>
					<div>
						<div>
								<div>
									<div style={{
										marginTop: '10px',
										'marginBottom':'0px',
										fontSize: '15px',
										fontWeight: 'bold'}}>
										<Translate text="Speech Output"/>
									</div>
									<Toggle
										className='settings-toggle'
										label={<Translate text="Enable speech output only for speech input"/>}
										disabled={!this.TTSBrowserSupport}
										onToggle={this.handleSpeechOutput}
										toggled={this.state.speechOutput}/>
								</div>
								<div>
									<div style={{
										marginTop: '10px',
										'marginBottom':'0px',
										fontSize: '15px',
										fontWeight: 'bold'}}>
										<Translate text="Speech Output Always ON"/>
									</div>
									<Toggle
										className='settings-toggle'
										label={<Translate text="Enable speech output regardless of input type"/>}
										disabled={!this.TTSBrowserSupport}
										onToggle={this.handleSpeechOutputAlways}
										toggled={this.state.speechOutputAlways}/>
								</div>
								<div>
									<div style={{
										marginTop: '10px',
										'marginBottom':'0px',
										fontSize: '15px',
										fontWeight: 'bold'}}>
										<Translate text="Speech Output Language"/>
									</div>
									<FlatButton
										className='settingsBtns'
										style={Buttonstyles}
										label={<Translate text="Select Default Language"/>}

										disabled={!this.TTSBrowserSupport}
										onClick={this.handleLanguage.bind(this,true)} />
								</div>
						</div>
					</div>
				</div>
			)
		}

		else if(this.state.selectedSetting === 'Text Language Settings') {
			currentSetting = (
				<div style={divStyle}>
					<div>
						<div style={{
							marginTop: '10px',
							'marginBottom':'0px',
							fontSize: '15px',
							fontWeight: 'bold'}}>
							<Translate text="Select Default Language"/>
						</div>
					</div>
						<DropDownMenu
							value={voiceOutput.voiceLang}
							disabled={!this.TTSBrowserSupport}
							onChange={this.handlePrefLang}>
							{voiceOutput.voiceMenu}
					 </DropDownMenu>
				</div>
			)
		}

		else if(this.state.selectedSetting === 'Account Settings' && cookies.get('loggedIn')) {
			currentSetting =
			<div style={divStyle}>
				<span>
					<div style={{
						marginTop: '10px',
						'marginBottom':'0px',
						fontSize: '15px',
						fontWeight: 'bold'}}>
						<Translate text="Change your Account Password"/>
					</div>
					<FlatButton
						className='settingsBtns'
						style={Buttonstyles}
						label={<Translate text="Change Password"/>}
						onClick={this.handleChangePassword} />
				</span>
			</div>
		}

		else if(this.state.selectedSetting === 'Connect to SUSI Hardware') {
			currentSetting = (
				<span style={divStyle}>
					<div>
					<div style={{
						marginTop: '10px',
						'marginBottom':'0px',
						fontSize: '15px',
						fontWeight: 'bold'}}>
						<Translate text="Connect to SUSI Hardware"/>
					</div>
					<FlatButton
						className='settingsBtns'
						style={Buttonstyles}
						label={<Translate text="Add address to connect to Hardware"/>}
						onClick={this.handleHardware} />
					</div>
				</span>
			)
		}

		else {
			currentSetting =
				<div style={divStyle}>
					<div style={{
						marginTop: '10px',
						'marginBottom':'0px',
						fontSize: '15px',
						fontWeight: 'bold'}}>
						<Translate text="Select Theme"/>
					</div>
					<DropDownMenu
						label={<Translate text="Default Theme"/>}
						value={this.state.theme}
						onChange={this.handleSelectChange}>
						<MenuItem value={'light'} primaryText={<Translate text="Light" />} />
						<MenuItem value={'dark'} primaryText={<Translate text="Dark" />} />
						<MenuItem value={'custom'}
						style={{display:this.showWhenLoggedIn}}
						primaryText={<Translate text="Custom" />} />
					</DropDownMenu>
						<div style={{
							marginTop: '10px',
							'marginBottom':'0px',
							fontSize: '15px',
							fontWeight: 'bold'}}>
							<Translate text="Enter As Send"/>
						</div>
						<Toggle
							className='settings-toggle'
							label={<Translate text="Send message by pressing ENTER"/>}
							onToggle={this.handleEnterAsSend}
							toggled={this.state.enterAsSend}/>
					</div>
		}

		let menuItems = cookies.get('loggedIn')?
			<Menu
				style={{width: '90%', margin: 'auto'}}
				onItemTouchTap={this.loadSettings}
				>
					<MenuItem>ChatApp Settings</MenuItem>
					<MenuItem>Mic Settings</MenuItem>
					<MenuItem>Speech Settings</MenuItem>
					<MenuItem>Text Language Settings</MenuItem>
					<MenuItem>Server Settings</MenuItem>
					<MenuItem>Account Settings</MenuItem>
					<MenuItem>Connect to SUSI Hardware</MenuItem>
			</Menu>
		:
		<Menu
			style={{width: '90%', margin: 'auto'}}
			onItemTouchTap={this.loadSettings}
			>
				<MenuItem>ChatApp Settings</MenuItem>
				<MenuItem>Mic Settings</MenuItem>
				<MenuItem>Speech Settings</MenuItem>
				<MenuItem>Text Language Settings</MenuItem>
				<MenuItem>Server Settings</MenuItem>
				<MenuItem>Connect to SUSI Hardware</MenuItem>
		</Menu>

		const tabStyle = {
  					height: 500,
  					width: '30%',
						margin: 20,
  					textAlign: 'center',
  					display: 'inline-block',
	 };
	 const menuStyle = {
					 height: 500,
					 width: '60%',
					 margin: 20,
					 textAlign: 'center',
					 display: 'inline-block',
	};

		return (
			<div>
        <StaticAppBar {...this.props}
            location={this.props.location} />
				<div className='settingMenu'>
					<Paper style={tabStyle} zDepth={2}>
						{menuItems}
						<div className='settingsSubmit'>
							<RaisedButton
								label={<Translate text="Save"/>}
								disabled={!this.state.validForm}
								backgroundColor='#4285f4'
								labelColor="#fff"
								onClick={this.handleSubmit}
							/>
						</div>
					</Paper>
					<Paper style={menuStyle} zDepth={2}>
						{currentSetting}
					</Paper>
				</div>
				<Dialog
          modal={false}
          autoScrollBodyContent={true}
          open={this.state.showLanguageSettings}
          onRequestClose={this.handleLanguage.bind(this,false)}>
          <TextToSpeechSettings
          	rate={this.state.speechRate}
          	pitch={this.state.speechPitch}
						lang={this.state.ttsLanguage}
          	ttsSettings={this.handleTextToSpeech}/>
          <Close style={closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
				{/* Hardware Connection */}
        <Dialog
          modal={false}
          open={this.state.showHardwareChangeDialog}
          autoScrollBodyContent={true}
          bodyStyle={bodyStyle}
          onRequestClose={this.handleClose}>
          <div>
            <HardwareComponent {...this.props} />
            <Close style={closingStyle}
            onTouchTap={this.handleClose} />
          </div>
        </Dialog>
				{/* Change Server */}
	        <Dialog
	          actions={serverDialogActions}
	          modal={false}
	          open={this.state.showServerChangeDialog}
	          autoScrollBodyContent={true}
	          bodyStyle={bodyStyle}
	          onRequestClose={this.handleServerToggle.bind(this,false)}>
	          <div>
	            <h3><Translate text="Change Server"/></h3>
	            <Translate text="Please login again to change SUSI server"/>
	            <Close style={closingStyle}
	            onTouchTap={this.handleServerToggle.bind(this,false)} />
	          </div>
	        </Dialog>
					{/* Change Password */}
		      <Dialog
		          className='dialogStyle'
		          modal={false}
		          open={this.state.showChangePasswordDialog}
		          autoScrollBodyContent={true}
		          bodyStyle={bodyStyle}
		          contentStyle={{width: '35%',minWidth: '300px'}}
		          onRequestClose={this.handleClose}>
		          <ChangePassword {...this.props} />
		          <Close style={closingStyle} onTouchTap={this.handleClose} />
		        </Dialog>
						{/* ForgotPassword */}
						<Dialog
								className='dialogStyle'
								modal={false}
								open={this.state.showForgotPassword}
								autoScrollBodyContent={true}
								contentStyle={{width: '35%',minWidth: '300px'}}
								onRequestClose={this.handleClose}>
								<ForgotPassword {...this.props}
								showForgotPassword={this.handleForgotPassword}/>
								<Close style={closingStyle}
								onTouchTap={this.handleClose}/>
							</Dialog>
		</div>);
	}
}

Settings.propTypes = {
	history: PropTypes.object,
	onSettingsSubmit: PropTypes.func,
	onServerChange: PropTypes.func,
	location: PropTypes.object,
	onHardwareSettings: PropTypes.func
};

export default Settings;
