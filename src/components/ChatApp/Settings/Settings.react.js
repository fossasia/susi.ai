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
import {Tabs, Tab} from 'material-ui-scrollable-tabs/Tabs';


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

	handleServer = () => {
		this.setState({
			showServerChangeDialog: true
		});
	}

	handleChangePassword = () => {
		this.setState({
			showChangePasswordDialog: true,
		});
	}

	handleHardware = () => {
		this.setState({
			showHardwareChangeDialog: true
		});
	}

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
			ttsLanguage: settings.lang,
			showLanguageSettings: false,
		});
	}

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

	onRequestClose = () => {
		this.props.history.push('/');
    window.location.reload();
	}

	handleLogin = () => {
    this.setState({
      showLogin: true,
      showSignUp: false,
			showForgotPassword: false,
			showOptions: false,
    });
  }

  handleSignUp = () => {
    this.setState({
      showSignUp: true,
      showLogin: false,
			showForgotPassword: false,
			showOptions: false,
    });
  }

	handleForgotPassword = () => {
		this.setState({
			showForgotPassword: true,
			showLogin: false,
			showOptions: false,
		});
	}

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

	render() {

		const bodyStyle = {
      'padding': 0,
      textAlign: 'center'
    }

		const Buttonstyles = {
			marginBottom: 16,
		}

		const subHeaderStyle = {
			backgroundColor: UserPreferencesStore.getTheme()==='light'
								? '#4285f4' : '#19314B',
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


		const styles = {
  		headline: {
    	fontSize: 24,
    	paddingTop: 16,
    	marginBottom: 12,
    	fontWeight: 400,
  		},
  		slide: {
    		padding: 20
  		},
		};

		let serverSettingTab = <Tab
			label={<Translate text="Server Settings" />}>
			<div style={styles.slide}>
				<h4 style={{'marginBottom':'0px'}}><Translate text="Select Server"/></h4>
				<CustomServer
					checked={this.state.checked}
					serverUrl={this.state.serverUrl}
					customServerMessage={this.customServerMessage}
					onServerChange={this.handleServeChange}/>
			</div>
		</Tab>

		let accountSettingTab;

		if(cookies.get('loggedIn')) {
			serverSettingTab = <Tab
				label={<Translate text="Server Settings" />}>
					<div style={styles.slide}>
						<h4 style={{'marginBottom':'0px'}}><Translate text="Select Server"/></h4>
							<FlatButton
								className='settingsBtns'
								style={Buttonstyles}
								label={<Translate text="Select backend server for the app"/>}
								onClick={this.handleServer} />
					</div>
			</Tab>

			accountSettingTab = <Tab
				label={<Translate text="Account Settings" />}>
					<div style={styles.slide}>
						<h4 style={{'marginBottom':'0px'}}><Translate text="Change your Account Password"/></h4>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label={<Translate text="Change Password"/>}
							onClick={this.handleChangePassword} />
					</div>
			</Tab>
		}


		let voiceOutput = this.populateVoiceList();
		return (
			<div>
                  <StaticAppBar {...this.props}
                      location={this.props.location} />
											<div className="settingsForm">
												<Tabs
													style={{marginTop: -15}}
													tabType={'scrollable'}
													tabItemContainerStyle={subHeaderStyle}
													inkBarStyle={{backgroundColor: 'white'}}
												>
													<Tab
														label={<Translate text="ChatApp Settings" />}>
														<div style={styles.slide}>
															<h4 style={{'marginBottom':'0px'}}><Translate text="Select Theme"/></h4>
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
																<h4 style={{'marginBottom':'0px'}}><Translate text="Enter As Send"/></h4>
																<Toggle
																	className='settings-toggle'
																	label={<Translate text="Send message by pressing ENTER"/>}
																	onToggle={this.handleEnterAsSend}
																	toggled={this.state.enterAsSend}/>
															</div>
													</Tab>
													<Tab
														label={<Translate text="Mic Settings" />}>
														<div style={styles.slide}>
															<h4 style={{'marginBottom':'0px'}}><Translate text="Mic Input"/></h4>
															<Toggle
																className='settings-toggle'
																label={<Translate text="Enable mic to give voice input"/>}
																disabled={!this.STTBrowserSupport}
																onToggle={this.handleMicInput}
																toggled={this.state.micInput}/>
														</div>
													</Tab>
													<Tab
														label={<Translate text="Speech Settings" />}>
														<div style={styles.slide}>
															<div>
																<h4 style={{'marginBottom':'0px'}}><Translate text="Speech Output"/></h4>
																<Toggle
																	className='settings-toggle'
																	label={<Translate text="Enable speech output only for speech input"/>}
																	disabled={!this.TTSBrowserSupport}
																	onToggle={this.handleSpeechOutput}
																	toggled={this.state.speechOutput}/>
															</div>
															<div>
																<h4 style={{'marginBottom':'0px'}}><Translate text="Speech Output Always ON"/></h4>
																<Toggle
																	className='settings-toggle'
																	label={<Translate text="Enable speech output regardless of input type"/>}
																	disabled={!this.TTSBrowserSupport}
																	onToggle={this.handleSpeechOutputAlways}
																	toggled={this.state.speechOutputAlways}/>
															</div>
															<div>
																<h4 style={{'marginBottom':'0px'}}><Translate text="Speech Output Language"/></h4>
																<FlatButton
																	className='settingsBtns'
																	style={Buttonstyles}
																	label={<Translate text="Select Default Language"/>}

																	disabled={!this.TTSBrowserSupport}
																	onClick={this.handleLanguage.bind(this,true)} />
															</div>
														</div>
													</Tab>
													<Tab
														label={<Translate text="Text Language Settings" />}>
														<div style={styles.slide}>
															<h4 style={{'marginBottom':'0px'}}><Translate text="Select Default Language"/></h4>
															<DropDownMenu
																value={voiceOutput.voiceLang}
																disabled={!this.TTSBrowserSupport}
																onChange={this.handlePrefLang}>
																{voiceOutput.voiceMenu}
														 </DropDownMenu>
														</div>
													</Tab>
													{serverSettingTab}
													{accountSettingTab}
													<Tab
														label={<Translate text="Connect to SUSI Hardware" />}>
														<div style={styles.slide} >
														<h4 style={{'marginBottom':'0px'}}><Translate text="Connect to SUSI Hardware"/></h4>
														<FlatButton
															className='settingsBtns'
															style={Buttonstyles}
															label={<Translate text="Add address to connect to Hardware"/>}
															onClick={this.handleHardware} />
														</div>
													</Tab>
												</Tabs>
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
							<div className='settingsSubmit'>
								<RaisedButton
									label={<Translate text="Save"/>}
									disabled={!this.state.validForm}
									backgroundColor='#4285f4'
									labelColor="#fff"
									onClick={this.handleSubmit}
								/>
							</div>
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
