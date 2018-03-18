import './Settings.css';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import UserIdentityStore from '../../../stores/UserIdentityStore';
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
import TextField from 'material-ui/TextField';
import StaticAppBar from '../../StaticAppBar/StaticAppBar.react';
import * as Actions from '../../../actions/';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import countryData from 'country-data';
import ShareOnSocialMedia from './ShareOnSocialMedia';
// Icons
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import ThemeIcon from 'material-ui/svg-icons/action/invert-colors';
import VoiceIcon from 'material-ui/svg-icons/action/settings-voice';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import SpeechIcon from 'material-ui/svg-icons/action/record-voice-over';
import AccountIcon from 'material-ui/svg-icons/action/account-box';
import LockIcon from 'material-ui/svg-icons/action/lock';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import ServerIcon from 'material-ui/svg-icons/file/cloud';
import HardwareIcon from 'material-ui/svg-icons/hardware/memory';
import MobileIcon from 'material-ui/svg-icons/hardware/phone-android';
import ShareIcon from 'material-ui/svg-icons/social/share';
const cookies = new Cookies();

class Settings extends Component {
	// Boolean to store the state of preview i.e which theme to display
	preview = false;
	// save a variable in state holding the initial state of the settings
	setInitialSettings = () => {
		let defaults = UserPreferencesStore.getPreferences();
		let identity = UserIdentityStore.getIdentity();
		let defaultServer = defaults.Server;
		let defaultTheme = UserPreferencesStore.getTheme(this.preview);
		let defaultEnterAsSend = defaults.EnterAsSend;
		let defaultMicInput = defaults.MicInput;
		let defaultSpeechOutput = defaults.SpeechOutput;
		let defaultSpeechOutputAlways = defaults.SpeechOutputAlways;
		let defaultSpeechRate = defaults.SpeechRate;
		let defaultSpeechPitch = defaults.SpeechPitch;
		let defaultPrefLanguage = defaults.PrefLanguage;
		let defaultChecked = defaults.checked;
		let defaultServerUrl= defaults.serverUrl;
		let defaultCountryCode = defaults.CountryCode;
		let defaultCountryDialCode = defaults.CountryDialCode;
		let defaultPhoneNo = defaults.phoneNo;
		this.setState({
			identity,
			intialSettings:{
				theme: defaultTheme,
				enterAsSend: defaultEnterAsSend,
				micInput: defaultMicInput,
				speechOutput: defaultSpeechOutput,
				speechOutputAlways: defaultSpeechOutputAlways,
				speechRate: defaultSpeechRate,
				speechPitch: defaultSpeechPitch,
				server: defaultServer,
				PrefLanguage: defaultPrefLanguage,
				serverUrl: defaultServerUrl,
				checked: defaultChecked,
				countryCode: defaultCountryCode,
				countryDialCode: defaultCountryDialCode,
				phoneNo: defaultPhoneNo
			}
		})
	}
	// extract values from store to get the initial settings
	setDefaultsSettings = () => {
	let defaults = UserPreferencesStore.getPreferences();
	let defaultServer = defaults.Server;
	let defaultTheme = UserPreferencesStore.getTheme(this.preview);
	let defaultEnterAsSend = defaults.EnterAsSend;
	let defaultMicInput = defaults.MicInput;
	let defaultSpeechOutput = defaults.SpeechOutput;
	let defaultSpeechOutputAlways = defaults.SpeechOutputAlways;
	let defaultSpeechRate = defaults.SpeechRate;
	let defaultSpeechPitch = defaults.SpeechPitch;
	let defaultTTSLanguage = defaults.TTSLanguage;
	let defaultPrefLanguage = defaults.PrefLanguage;
	let defaultChecked = defaults.checked;
	let defaultServerUrl= defaults.serverUrl;
	let defaultCountryCode = defaults.CountryCode;
	let defaultCountryDialCode =defaults.CountryDialCode;
	let defaultPhoneNo = defaults.phoneNo;
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
		this.setState({
			theme: defaultTheme,
			enterAsSend: defaultEnterAsSend,
			micInput: defaultMicInput,
			speechOutput: defaultSpeechOutput,
			speechOutputAlways: defaultSpeechOutputAlways,
			server: defaultServer,
			serverUrl: defaultServerUrl,
			serverFieldError: false,
			checked: defaultChecked,
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
			countryCode: defaultCountryCode,
			countryDialCode: defaultCountryDialCode,
			phoneNo: defaultPhoneNo,
			newTtsSettings:{
				rate: defaultSpeechRate,
				pitch: defaultSpeechPitch,
				lang: defaultTTSLanguage,
			},
			voiceList: [
			{
				lang: 'am-AM',
				name: 'Armenian'
			},{
				lang: 'zh-CH',
				name: 'Chinese'
			},{
				lang: 'de-DE',
				name: 'Deutsch'
			},{
				lang: 'gr-GR',
				name: 'Greek'
			},{
				lang: 'hi-IN',
				name: 'Hindi'
			},{
				lang: 'ru-RU',
				name: 'Russian'
			},{
				lang: 'es-SP',
				name: 'Spanish'
			},{
				lang: 'fr-FR',
				name: 'French'
      },{
				lang: 'jp-JP',
				name: 'Japanese'
			},{
				lang: 'nl-NL',
				name: 'Dutch'
			},{lang: 'en-US',
				name: 'US English'
			}]
		});
		this.customServerMessage = '';
		this.TTSBrowserSupport = TTSBrowserSupport;
		this.STTBrowserSupport = STTBrowserSupport;
	}

	/**
	 * Event handler for 'change' events coming from the UserPreferencesStore
	 */
	_onChangeSettings() {
	  this.setInitialSettings();
	  this.setDefaultsSettings();
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
	handleClose = () => {
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
		let newDefaultServer = this.state.server;
		let newEnterAsSend = this.state.enterAsSend;
		let newMicInput = this.state.micInput;
		let newSpeechOutput = this.state.speechOutput;
		let newSpeechOutputAlways = this.state.speechOutputAlways;
		let newSpeechRate = this.state.speechRate;
		let newSpeechPitch = this.state.speechPitch;
		let newTTSLanguage = this.state.ttsLanguage;
		let newPrefLanguage = this.state.PrefLanguage;
		let checked = this.state.checked;
		let serverUrl = this.state.serverUrl;
		let newCountryCode = !this.state.countryCode?
		this.intialSettings.countryCode:this.state.countryCode;
		let newCountryDialCode = !this.state.countryDialCode?
		this.intialSettings.countryDialCode:this.state.countryDialCode;
		let newPhoneNo = this.state.phoneNo;
		if(newDefaultServer.slice(-1)==='/'){
			newDefaultServer = newDefaultServer.slice(0,-1);
		}
		let vals = {
			server: newDefaultServer,
			enterAsSend: newEnterAsSend,
			micInput: newMicInput,
			speechOutput: newSpeechOutput,
			speechOutputAlways: newSpeechOutputAlways,
			speechRate: newSpeechRate,
			speechPitch: newSpeechPitch,
			ttsLanguage: newTTSLanguage,
			prefLanguage: newPrefLanguage,
			countryCode: newCountryCode,
			countryDialCode: newCountryDialCode,
			phoneNo: newPhoneNo,
			checked,
			serverUrl
		}
		// if preview, save current theme state to previewTheme
		if (this.preview) {
			vals.theme = UserPreferencesStore.getTheme(!this.preview);
			vals.previewTheme = this.state.theme;
		}
		// else save current theme state to theme
		else {
			vals.theme = this.state.theme;
			vals.previewTheme = UserPreferencesStore.getTheme(this.preview);
		}
		let settings = Object.assign({}, vals);
		settings.LocalStorage = true;
		// Store in cookies for anonymous user
		cookies.set('settings', settings);
		console.log('settings saved', settings);
		this.setInitialSettings();
		// Trigger Actions to save the settings in stores and server
		this.implementSettings(vals);
	}

	// Store the settings in stores and server
	implementSettings = (values) => {
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
	this.props.history.push(`/settings?tab=${this.state.selectedSetting}`);
  }

	// Handle change to theme settings
	handleSelectChange = (event, value) => {
		this.preview = true;
		this.setState({ theme: value },()=> {
				this.handleSubmit();
				this.preview = false;
		});
	}

	// Handle change to enter as send settings
	handleEnterAsSend = (event, isInputChecked) => {
		this.setState({
			enterAsSend: isInputChecked
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
		this.resetNewTtsSettings();
	}

	// Handle change to TTS settings
	handleTextToSpeech = () => {
		let settings=this.state.newTtsSettings;
		this.setState({
			speechRate: settings.rate,
			speechPitch: settings.pitch,
			ttsLanguage: settings.lang,
			showLanguageSettings: false,
		});
	}

	// save new TTS settings
	handleNewTextToSpeech = (settings) =>{
		let newTtsSettings={
			rate: settings.rate,
			pitch: settings.pitch,
			lang:  settings.lang
		}
		this.setState({newTtsSettings});
	}

	// return true if TTS settings has been changed
	ttsSettingsChanged = () =>{
		if(this.state.newTtsSettings.rate!==this.state.speechRate){
			return true;
		}
		else if(this.state.newTtsSettings.pitch!==this.state.speechPitch){
			return true;
		}
		else if(this.state.newTtsSettings.lang!==this.state.ttsLanguage){
			return true;
		}
		return false;
	}

	// reset new TTS settings to last saved settings
	resetNewTtsSettings = () =>{
		let newTtsSettings={
			rate: this.state.speechRate,
			pitch: this.state.speechPitch,
			lang:  this.state.ttsLanguage
		}
		this.setState({newTtsSettings});
	}

	// Handle toggle between default server and custom server
	handleServeChange = (event) => {
		let state = this.state;
		let serverUrl
		if (event.target.value === 'customServer') {
			state.checked = !state.checked;
			let defaults = UserPreferencesStore.getPreferences();
			state.serverUrl = defaults.StandardServer;
			state.serverFieldError = false;
		}
		else if (event.target.name === 'serverUrl') {
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
		else {
			this.customServerMessage = '';
		}

		if (this.state.serverFieldError && this.state.checked) {
			this.setState({ validForm: false });
		}
		else {
			this.setState({ validForm: true });
		}
	}

	handleServerToggle = (changeServer) => {
		if (changeServer) {
			// Logout the user and show the login screen again
			this.props.history.push('/logout');
			this.setState({
				showLogin: true
			});
		}
		else {
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
		this.setDefaultsSettings();
		this.setInitialSettings();
	}

	componentWillUnmount() {
		MessageStore.removeChangeListener(this._onChange.bind(this));
		UserPreferencesStore.removeChangeListener(this._onChangeSettings.bind(this));
	}

	// Populate language list
	_onChange() {
		this.setState({
			voiceList: [{
				lang: 'de-DE',
				name: 'Deutsch'
			}, {
				lang: 'am-AM',
				name: 'Armenian'
			}, {
				lang: 'en-US',
				name: 'US English'
			}, {
				lang: 'gr-GR',
				name: 'Greek'
			}, {
				lang: 'hi-IN',
				name: 'Hindi'
			}, {
				lang: 'fr-FR',
				name: 'French'
			}, {
				lang: 'ru-RU',
				name: 'Russian'
			},{
				lang: 'jp-JP',
				name: 'Japanese'
			},{
				lang: 'nl-NL',
				name: 'Dutch'
      }]
		});
	}

	componentDidMount() {
		document.title = 'Settings - SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
		MessageStore.addChangeListener(this._onChange.bind(this));
		UserPreferencesStore.addChangeListener(this._onChangeSettings.bind(this));
		this.setState({
			search: false,
		});

		this.showWhenLoggedIn = 'none';
		let searchParams = new URLSearchParams(window.location.search);
		let tab = searchParams.get('tab');
		if (tab) {
			this.setState({
				selectedSetting: tab
			})
		}
		else{
			this.setState({
			selectedSetting: cookies.get('loggedIn')? 'Account':'ChatApp Settings'
		})
		}
		this.showWhenLoggedIn='none';
	}

	// Generate language list drop down menu items
	populateVoiceList = () => {
		let voices = this.state.voiceList;
		let langCodes = [];
		let voiceMenu = voices.map((voice, index) => {
			langCodes.push(voice.lang);
			return (
				<MenuItem value={voice.lang} key={index}
					primaryText={voice.name + ' (' + voice.lang + ')'} />
			);
		});
		let currLang = this.state.PrefLanguage;
		let voiceOutput = {
			voiceMenu: voiceMenu,
			voiceLang: currLang
		}
		// `-` and `_` replacement check of lang codes
		if (langCodes.indexOf(currLang) === -1) {
			if (currLang.indexOf('-') > -1 && langCodes.indexOf(currLang.replace('-', '_')) > -1) {
				voiceOutput.voiceLang = currLang.replace('-', '_');
			}
			else if (currLang.indexOf('_') > -1 && langCodes.indexOf(currLang.replace('_', '-')) > -1) {
				voiceOutput.voiceLang = currLang.replace('_', '-');
			}
		}
		return voiceOutput;
	}

	loadSettings = (e) => {
		this.setDefaultsSettings();// on every tab change, load the default settings
		this.setState({ selectedSetting: e.target.innerText });
		this.setState({ settingNo: e.target.innerText });
		//  Revert to original theme if user navigates away without saving.
		if (this.state.theme !== UserPreferencesStore.getTheme()) {
			this.setState({theme : UserPreferencesStore.getTheme()},
			() => {this.handleSubmit()});
		}
	}

	displaySaveChangesButton = () =>{
		let selectedSetting=this.state.selectedSetting;
		if(selectedSetting==='Password')
		{
			return false;
		}
		if (selectedSetting === 'Connect to SUSI Hardware') {
			return false;
		}
		if(selectedSetting==='Account')
		{
			return false;
		}
		if(selectedSetting==='Server Settings' && cookies.get('loggedIn'))
		{
			return false;
		}
		if(selectedSetting==='Share on Social media')
		{
			return false;
		}
		return true;// display the button otherwise
	}
	getSomethingToSave = () => {
		let somethingToSave = false;
		const intialSettings = this.state.intialSettings;
		const classState = this.state;
		if (UserPreferencesStore.getTheme() !== this.state.theme) {
			somethingToSave = true;
		}
		else if (intialSettings.enterAsSend !== classState.enterAsSend) {
			somethingToSave = true;
		}
		else if (intialSettings.micInput !== classState.micInput) {
			somethingToSave = true;
		}
		else if (intialSettings.speechOutput !== classState.speechOutput) {
			somethingToSave = true;
		}
		else if (intialSettings.speechOutputAlways !== classState.speechOutputAlways) {
			somethingToSave = true;
		}

		else if (intialSettings.speechRate !== classState.speechRate) {
			somethingToSave = true;
		}
		else if (intialSettings.speechPitch !== classState.speechPitch) {
			somethingToSave = true;
		}
		else if (intialSettings.server !== classState.server) {
			somethingToSave = true;
		}
		else if (intialSettings.checked !== classState.checked) {
			somethingToSave = true;
		}
		else if (intialSettings.PrefLanguage !== classState.PrefLanguage) {
			somethingToSave = true;
		}
		else if (intialSettings.countryCode !== classState.countryCode) {
			somethingToSave = true;
		}
		else if(intialSettings.serverUrl !== classState.serverUrl)
		{
			somethingToSave=true;
		}
		else if (intialSettings.phoneNo !== classState.phoneNo) {
			somethingToSave = true;
		}
		else if(intialSettings.PrefLanguage!==classState.PrefLanguage)
		{
			somethingToSave=true;
		}
		return somethingToSave;
	}
	handleCountryChange = (event, index, value) => {
		this.setState({
			'countryCode': value,
			'countryDialCode': countryData.countries[value ? value : 'US'].countryCallingCodes[0]
		});
	}
	handleTelephoneNoChange = (event, value) => {
		this.setState({ 'phoneNo': value });
	}
	render() {

		document.body.style.setProperty('background-image', 'none');
		const bodyStyle = {
			'padding': 0,
			textAlign: 'center'
		}
		const themeBackgroundColor=this.state.intialSettings.theme==='dark'?'#19324c':'#fff';
		const themeForegroundColor=this.state.intialSettings.theme==='dark'?'#fff':'#272727';

		const floatingLabelStyle={
			color:'#9e9e9e'
		}
		const underlineStyle ={
			color:this.state.intialSettings.theme==='dark'?'#9E9E9E':null,
			borderColor:this.state.intialSettings.theme==='dark'?'#9E9E9E':null
		}
		const menuIconColor=this.state.intialSettings.theme==='dark'?themeForegroundColor:null;
		countryData.countries.all.sort(function (a, b) {
			if (a.name < b.name) { return -1 };
			if (a.name > b.name) { return 1 };
			return 0;
		});
		let countries = countryData.countries.all.map((country, i) => {
			if(countryData.countries.all[i].countryCallingCodes[0]) {
				return (<MenuItem value={countryData.countries.all[i].alpha2} key={i} primaryText={countryData.countries.all[i].name + ' ' + countryData.countries.all[i].countryCallingCodes[0]} />);
			}
			return null;
		});
		const closingStyle = {
			position: 'absolute',
			zIndex: 1200,
			fill: '#444',
			width: '26px',
			height: '26px',
			right: '10px',
			top: '10px',
			cursor: 'pointer'
		}

		const serverDialogActions = [
			<RaisedButton
				key={'Cancel'}
				label={<Translate text="Cancel" />}
				backgroundColor={
					UserPreferencesStore.getTheme() === 'light' ? '#4285f4' : '#19314B'}
				labelColor="#fff"
				width='200px'
				keyboardFocused={false}
				onTouchTap={this.handleServerToggle.bind(this, false)}
				style={{ margin: '6px' }}
			/>,
			<RaisedButton
				key={'OK'}
				label={<Translate text="OK" />}
				backgroundColor={
					UserPreferencesStore.getTheme() === 'light' ? '#4285f4' : '#19314B'}
				labelColor="#fff"
				width='200px'
				keyboardFocused={false}
				onTouchTap={this.handleServerToggle.bind(this, true)}
			/>];

		const Buttonstyles = {
			marginBottom: '15px',
			marginTop: '15px',
			marginLeft: '35px',
		}

		const divStyle = {
			textAlign: 'left',
			padding: '20px',
			marginLeft: '10px',
		}

		const radioIconStyle = {
			fill: '#4285f4'
		}

		let currentSetting;


		let voiceOutput = this.populateVoiceList();
		if (this.state.selectedSetting === 'Server Settings') {
			currentSetting = (
				<div style={divStyle}>
					<div style={{
						marginTop: '10px',
						'marginBottom': '0px',
						fontSize: '15px',
						fontWeight: 'bold'
					}}>
						<Translate text="Select Server" />
					</div>
					<div style={{textAlign : 'left', marginLeft: '30px !important'}}>
					<CustomServer
						checked={this.state.checked}
						settings={this.state.intialSettings}
						serverUrl={this.state.serverUrl}
						customServerMessage={this.customServerMessage}
						onServerChange={this.handleServeChange}/>
					</div>
				</div>
			)

			if (cookies.get('loggedIn')) {
				currentSetting = (
					<div style={divStyle}>
						<div>
							<div style={{
								marginTop: '10px',
								'marginBottom': '0px',
								fontSize: '15px',
								fontWeight: 'bold'
							}}>
								<Translate text="Select Server" />
							</div>
								<FlatButton
									className='settingsBtns'
									labelStyle={{color:themeForegroundColor}}
									style={Buttonstyles}
									label={<Translate text="Select backend server for the app"/>}
									onClick={this.handleServer} />
						</div>
					</div>
				)
			}
		}

		else if (this.state.selectedSetting === 'Mic Settings') {
			currentSetting = '';
			currentSetting = (
				<div style={divStyle}>
					<div>
						<div>
							<div style={{
								marginTop: '10px',
								'marginBottom': '0px',
								fontSize: '15px',
								fontWeight: 'bold'
							}}>
								<Translate text="Mic Input" />
							</div><br />
							<div style={{
								float: 'left',
								padding: '0px 5px 0px 0px'
							}}>
								<Translate text="Enable mic to give voice input "/>
							</div>
							<Toggle
								className='settings-toggle'
								labelStyle={{color:themeForegroundColor}}
								disabled={!this.STTBrowserSupport}
								onToggle={this.handleMicInput}
								toggled={this.state.micInput} />
							<br />
						</div>
					</div>
				</div>
			)
		}
		else if(this.state.selectedSetting === 'Share on Social media') {
			currentSetting = '';
			currentSetting = (
				<div style={divStyle}>
				<ShareOnSocialMedia/>
				</div>
				)
		}
		else if (this.state.selectedSetting === 'Theme') {
			currentSetting = '';
			currentSetting = (
				<div style={divStyle}>
					<span>
						<div style={{
							marginTop: '10px',
							'marginBottom': '0px',
							fontSize: '15px',
							fontWeight: 'bold'
						}}>
							<Translate text="Select Theme" />
						</div>
					</span>
					<RadioButtonGroup
						style={{ textAlign: 'left', margin: 20 }}
						onChange={this.handleSelectChange}
						name="Theme"
						valueSelected={this.state.theme}>
						<RadioButton
							style={{width: '20%', display: 'block'}}
							iconStyle={radioIconStyle}
							labelStyle={{color:themeForegroundColor}}
							value='light'
							label={<Translate text="Light" />}
						/>
						<RadioButton
							style={{width: '20%', display: 'block'}}
							iconStyle={radioIconStyle}
							labelStyle={{color:themeForegroundColor}}
							value='dark'
							label={<Translate text="Dark" />}
						/>
						<RadioButton
							style={{width: '20%', display: cookies.get('loggedIn')?'inline-block':'none'}}
							iconStyle={radioIconStyle}
							labelStyle={{color:themeForegroundColor}}
							value='custom'
							label={<Translate text="Custom" />}
						/>
					</RadioButtonGroup>
				</div>
			)
		}

		else if (this.state.selectedSetting === 'Speech Settings') {
			currentSetting = (
				<div style={divStyle}>
								<div>
									<div style={{
										marginTop: '10px',
										'marginBottom':'0px',
										fontSize: '15px',
										fontWeight: 'bold'}}>
										<Translate text="Speech Output"/>
									</div><br />
									<div style={{
										float: 'left',
										padding: '0px 5px 0px 0px'
									}}>
										<Translate text="Enable speech output only for speech input"/>
									</div>
									<Toggle
										className='settings-toggle'
										disabled={!this.TTSBrowserSupport}
										labelStyle={{color:themeForegroundColor}}
										onToggle={this.handleSpeechOutput}
										toggled={this.state.speechOutput}/>
									<br /><br />
								</div>
								<div>
									<div style={{
										marginTop: '10px',
										'marginBottom':'0px',
										fontSize: '15px',
										fontWeight: 'bold'}}>
										<Translate text="Speech Output Always ON"/>
									</div><br />
									<div style={{
										float: 'left',
										padding: '5px 5px 0px 0px'
									}}>
										<Translate text="Enable speech output regardless of input type"/>
									</div>
									<Toggle
										className='settings-toggle'
										disabled={!this.TTSBrowserSupport}
										labelStyle={{color:themeForegroundColor}}
										onToggle={this.handleSpeechOutputAlways}
										toggled={this.state.speechOutputAlways}/>
									<br /><br />
								</div>
								<div>
									<div style={{
										marginTop: '10px',
										marginBottom:'10px',
										fontSize: '15px',
										fontWeight: 'bold'}}>
										<Translate text="Speech Output Language"/>
									</div>
									<RaisedButton
										label={<Translate text="Select Default Language"/>}
										style={{backgroundColor:'transparent'}}
										buttonStyle={{backgroundColor:'transparent'}}
										labelStyle={{color:themeForegroundColor}}
										disabled={!this.TTSBrowserSupport}
										onClick={this.handleLanguage.bind(this,true)} />
								</div>
				</div>
			)
		}

		else if (this.state.selectedSetting === 'Text Language Settings') {
			currentSetting = (
				<div style={divStyle}>
					<span>
						<div style={{
							marginTop: '10px',
							'marginBottom': '0px',
							fontSize: '15px',
							fontWeight: 'bold'
						}}>
							<Translate text="Select Default Language" />
						</div>
					</span>
						<DropDownMenu
							value={voiceOutput.voiceLang}
							disabled={!this.TTSBrowserSupport}
							labelStyle={{color:themeForegroundColor}}
							menuStyle={{backgroundColor:themeBackgroundColor}}
							menuItemStyle={{color:themeForegroundColor}}
							onChange={this.handlePrefLang}>
							{voiceOutput.voiceMenu}
					 </DropDownMenu>
				</div>
			)
		}

		else if(this.state.selectedSetting === 'Password' && cookies.get('loggedIn')) {
			currentSetting =
			<div style={divStyle}>
				<span>
					<span>
						<div style={{
							marginTop: '10px',
							'marginBottom':'0px',
							fontSize: '15px',
							fontWeight: 'bold'}}>
							<Translate text="Change your Account Password"/>
						</div>
					</span>
					<ChangePassword settings={this.state.intialSettings} {...this.props} />
				</span>
			</div>
		}

		else if(this.state.selectedSetting === 'Account' && cookies.get('loggedIn')) {
			currentSetting =
			<div style={divStyle}>
				<span>
					<div style={{
						marginTop: '10px',
						'marginBottom':'0px',
						fontSize: '15px',
						fontWeight: 'bold'}}>
						<Translate text="Your Account"/>
					</div>
					<TextField
						name="email"
						disabled={true}
						underlineDisabledStyle={UserPreferencesStore.getTheme()==='dark'?underlineStyle:null}
						underlineStyle={underlineStyle}
						inputStyle={{color:UserPreferencesStore.getTheme()==='dark'?'#fff':'#333'}}
                  		value={this.state.identity.name}
						floatingLabelStyle={floatingLabelStyle}
                  		floatingLabelText={<Translate text="Your Email"/>} />
				</span>
			</div>
		}

		else if (this.state.selectedSetting === 'Connect to SUSI Hardware') {
			currentSetting = (
				<span style={divStyle}>
					<div>
						<span>
							<div style={{
								marginTop: '10px',
								'marginBottom': '0px',
								marginLeft: '30px',
								fontSize: '15px',
								fontWeight: 'bold'
							}}>
								<Translate text="Connect to SUSI Hardware" />
							</div>
						</span>
						<HardwareComponent settings={this.state.intialSettings} {...this.props} />
					</div>
				</span>
			)
		}
		else if (this.state.selectedSetting === 'Mobile' && cookies.get('loggedIn')) {
			currentSetting = (
				<span style={divStyle}>
					<div>
						<div style={{
							marginTop: '10px',
							'marginBottom': '0px',
							marginLeft: '30px',
							fontSize: '15px',
							fontWeight: 'bold'
						}}>
							<Translate text="Mobile" />
						</div>
						<div style={{
							marginTop: '0px',
							'marginBottom': '0px',
							marginLeft: '30px',
							fontSize: '14px'
						}}>
							<Translate text="Expand your experience, get closer, and stay current" />
						</div>
						<hr color="#f8f8f8" />
						<div style={{
							marginTop: '0px',
							'marginBottom': '0px',
							marginLeft: '30px',
							fontSize: '15px',
							fontWeight: 'bold'
						}}>
							<Translate text="Add your phone number" />
						</div>
						<div style={{
							marginTop: '10px',
							'marginBottom': '0px',
							marginLeft: '30px',
							fontSize: '14px'
						}}>
							<Translate text="We will text a verification code to this number. Standard SMS fees may apply." />
						</div>
						<div style={{
							marginTop: '10px',
							'marginBottom': '0px',
							marginLeft: '30px',
							fontSize: '14px'
						}}>
							<Translate text="Country/region : " />
							<DropDownMenu maxHeight={300}
								style={{ width: '250px', position: 'relative', top: '15px' }}
								labelStyle={{color:themeForegroundColor}}
								menuStyle={{backgroundColor:themeBackgroundColor}}
								menuItemStyle={{color:themeForegroundColor}}
								value={this.state.countryCode ? this.state.countryCode : 'US'}
								onChange={this.handleCountryChange}>
								{countries}
							</DropDownMenu>

						</div>
						<div style={{
							marginTop: '-10px',
							'marginBottom': '0px',
							marginLeft: '30px',
							fontSize: '14px',
						}}>
							<Translate text="Phone number : " />
							<TextField name="selectedCountry"
								disabled={true}
								underlineDisabledStyle={UserPreferencesStore.getTheme()==='dark'?underlineStyle:null}
								inputStyle={{color:UserPreferencesStore.getTheme()==='dark'?'#fff':'#333'}}
		                  		floatingLabelStyle={floatingLabelStyle}
								value={countryData.countries[this.state.countryCode ? this.state.countryCode : 'US'].countryCallingCodes[0]}
								style={{ width: '45px', marginLeft: '30px' }}
							/>
							<TextField name="phonenumber"
								style={{ width: '150px', marginLeft: '5px' }}
								onChange={this.handleTelephoneNoChange}
								inputStyle={{color:UserPreferencesStore.getTheme()==='dark'?'#fff':'#333'}}
		                  		floatingLabelStyle={floatingLabelStyle}
								value={this.state.phoneNo}
								floatingLabelText={<Translate text="Phone number" />} />
						</div>
					</div>
				</span>
			)
		}
		else {
			currentSetting = (
				<div style={divStyle}>
					<div style={{
						marginTop: '10px',
						'marginBottom': '0px',
						fontSize: '15px',
						fontWeight: 'bold'
					}}>
						<Translate text="Preferences" />
					</div><br />
					<div style={{
						float: 'left',
						padding: '0px 5px 0px 0px'
					}}>
						<Translate text="Send message by pressing ENTER" />
					</div>
					<Toggle
						className='settings-toggle'
						onToggle={this.handleEnterAsSend}
						labelStyle={{color:themeForegroundColor}}
						toggled={this.state.enterAsSend}/>
					<br />
				</div>);
		}
		let blueThemeColor={color: 'rgb(66, 133, 244)'};
		var buttonstyle={
			fontSize:'14px',
			boxSizing:'border-box',
			padding:'10px 16px',
			fontFamily:'Roboto, sans-serif',
			height:'36px',
			lineHeight:'50px',
			borderRadius:'2px',
			backgroundColor:'#4285f4',
			color:'#fff',
			textDecoration:'none',
			fontWeight:'500',
			boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
			transition:'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
			marginLeft:'3.6%',
		}
		let menuItems = cookies.get('loggedIn')?
		<div>
		<div className="settings-list">
		<Menu
			onItemTouchTap={this.loadSettings}
			selectedMenuItemStyle={blueThemeColor}
			style={{width:'100%'}}
			value={this.state.selectedSetting}
			>
			<MenuItem style={{color:themeForegroundColor}} value='Account' className="setting-item" leftIcon={<AccountIcon color={menuIconColor}/>}>Account<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Password' className="setting-item" leftIcon={<LockIcon color={menuIconColor}/>}>Password<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='ChatApp Settings' className="setting-item" leftIcon={<ChatIcon color={menuIconColor}/>}>ChatApp Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Theme' className="setting-item" leftIcon={<ThemeIcon color={menuIconColor}/>}>Theme<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Mic Settings' className="setting-item" leftIcon={<VoiceIcon color={menuIconColor}/>}>Mic Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Speech Settings' className="setting-item" leftIcon={<SpeechIcon color={menuIconColor}/>}>Speech Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Text Language Settings' className="setting-item" leftIcon={<LanguageIcon color={menuIconColor}/>}>Text Language Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Server Settings' className="setting-item" leftIcon={<ServerIcon color={menuIconColor}/>}>Server Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Connect to SUSI Hardware' className="setting-item"  leftIcon={<HardwareIcon color={menuIconColor}/>}>Connect to SUSI Hardware<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Mobile' className="setting-item" leftIcon={<MobileIcon color={menuIconColor} />}>Mobile<ChevronRight style={{color:themeForegroundColor}} className="right-chevron" /></MenuItem>
			<hr className="break-line"/>
			<MenuItem style={{color:themeForegroundColor}} value='Share on Social media' className="setting-item" leftIcon={<ShareIcon color={menuIconColor}/>}>Share on Social media<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
			<hr className="break-line"/>
		</Menu>
		</div>
		<div className="settings-list-dropdown">
		<DropDownMenu
			selectedMenuItemStyle={blueThemeColor}
			onChange={this.loadSettings}
			value={this.state.selectedSetting}
			labelStyle={{color:themeForegroundColor}}
			menuStyle={{backgroundColor:themeBackgroundColor}}
			menuItemStyle={{color:themeForegroundColor}}
			style={{width:'100%'}}
			autoWidth={false}
        >
				<MenuItem primaryText='Account' value='Account' className="setting-item"/>
				<MenuItem primaryText='Password' value='Password' className="setting-item"/>
				<MenuItem primaryText='ChatApp Settings' value='ChatApp Settings' className="setting-item"/>
				<MenuItem primaryText='Theme' value='Theme' className="setting-item"/>
				<MenuItem primaryText='Mic Settings' value='Mic Settings' className="setting-item"/>
				<MenuItem primaryText='Speech Settings' value='Speech Settings' className="setting-item"/>
				<MenuItem primaryText='Text Language Settings' value='Text Language Settings' className="setting-item"/>
				<MenuItem primaryText='Server Settings' value='Server Settings' className="setting-item"/>
				<MenuItem primaryText='Connect to SUSI Hardware' value='Connect to SUSI Hardware' className="setting-item"/>
				<MenuItem primaryText='Mobile' value='Mobile' className="setting-item" />
				<MenuItem primaryText='Share on Social media' value='Share on Social media' className="setting-item"/>
		</DropDownMenu>
		</div>
		<div><a href="/" style={buttonstyle}>BACK TO CHAT</a></div>
		</div>

		:
		<div>
		<div className="settings-list">
		<Menu
			onItemTouchTap={this.loadSettings}
			selectedMenuItemStyle={blueThemeColor}
			style={{width:'100%',height:'100%'}}
			value={this.state.selectedSetting}
			>
				<MenuItem style={{color:themeForegroundColor}} value='ChatApp Settings' className="setting-item" leftIcon={<ChatIcon color={menuIconColor}/>}>ChatApp Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
				<MenuItem style={{color:themeForegroundColor}} value='Theme' className="setting-item" leftIcon={<ThemeIcon color={menuIconColor}/>}>Theme<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
				<MenuItem style={{color:themeForegroundColor}} value='Mic Settings' className="setting-item" leftIcon={<VoiceIcon color={menuIconColor}/>}>Mic Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
				<MenuItem style={{color:themeForegroundColor}} value='Speech Settings' className="setting-item" leftIcon={<SpeechIcon color={menuIconColor}/>}>Speech Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
				<MenuItem style={{color:themeForegroundColor}} value='Text Language Settings' className="setting-item" leftIcon={<LanguageIcon color={menuIconColor}/>}>Text Language Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
				<MenuItem style={{color:themeForegroundColor}} value='Server Settings' className="setting-item" leftIcon={<ServerIcon color={menuIconColor}/>}>Server Settings<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
				<MenuItem style={{color:themeForegroundColor}} value='Connect to SUSI Hardware' className="setting-item"  leftIcon={<HardwareIcon color={menuIconColor}/>}>Connect to SUSI Hardware<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
				<MenuItem style={{color:themeForegroundColor}} value='Share on Social media' className="setting-item" leftIcon={<ShareIcon color={menuIconColor}/>}>Share on Social media<ChevronRight style={{color:themeForegroundColor}} className="right-chevron"/></MenuItem>
				<hr className="break-line"/>
		</Menu>
		<div><a href="/" style={buttonstyle}>BACK TO CHAT</a></div>
		</div>
		<div className="settings-list-dropdown">
		<DropDownMenu
			selectedMenuItemStyle={blueThemeColor}
			onChange={this.loadSettings}
			value={this.state.selectedSetting}
			style={{width:'100%'}}
			labelStyle={{color:themeForegroundColor}}
			menuStyle={{backgroundColor:themeBackgroundColor}}
			menuItemStyle={{color:themeForegroundColor}}
			autoWidth={false}
        >
				<MenuItem primaryText='ChatApp Settings' value='ChatApp Settings' className="setting-item"/>
				<MenuItem primaryText='Theme' value='Theme' className="setting-item"/>
				<MenuItem primaryText='Mic Settings' value='Mic Settings' className="setting-item"/>
				<MenuItem primaryText='Speech Settings' value='Speech Settings' className="setting-item"/>
				<MenuItem primaryText='Text Language Settings' value='Text Language Settings' className="setting-item"/>
				<MenuItem primaryText='Server Settings' value='Server Settings' className="setting-item"/>
				<MenuItem primaryText='Connect to SUSI Hardware' value='Connect to SUSI Hardware' className="setting-item"/>
				<MenuItem primaryText='Share on Social media' value='Share on Social media' className="setting-item"/>
		</DropDownMenu>
		<div><a href="/" style={buttonstyle}>BACK TO CHAT</a></div>
		</div>
		</div>
	 const menuStyle = {
					 marginTop: 20,
					 textAlign: 'center',
					 display: 'inline-block',
					 backgroundColor:themeBackgroundColor,
					 color:themeForegroundColor
	};
	const ttsSettingsChanged=this.ttsSettingsChanged();
	const actionsTextToSpeechDialog = [
      <FlatButton
        label="Cancel"
		key={'Cancel'}
        primary={false}
        onClick={this.handleClose}
      />,
      <RaisedButton
		label={<Translate text="Save"/>}
		key={'Save'}
		backgroundColor={
			UserPreferencesStore.getTheme() === 'light' ? '#4285f4' : '#19314B'}
		labelColor="#fff"
        onClick={this.handleTextToSpeech}
		disabled={!ttsSettingsChanged}
      />,
    ];
	// to check if something has been modified or not
	let somethingToSave=this.getSomethingToSave();
		return (
			<div className="settings-container">
		<StaticAppBar settings={this.state.intialSettings} {...this.props}
			location={this.props.location} />
				<div className='settingMenu'>
					<Paper className='leftMenu tabStyle' zDepth={1} style={{backgroundColor:themeBackgroundColor, color:themeForegroundColor}}>
						{menuItems}
					</Paper>
					<Paper className='rightMenu' style={menuStyle} zDepth={1}>
						{currentSetting}
						<div className='settingsSubmit'>
							{this.displaySaveChangesButton() &&
								<RaisedButton
									label={<Translate text="Save Changes" />}
									disabled={!this.state.validForm || !somethingToSave}
									backgroundColor='#4285f4'
									labelColor="#fff"
									onClick={this.handleSubmit}
								/>
							}
						</div>
					</Paper>
				</div>
				<Dialog
					modal={false}
					title={<h3><Translate text="Text-To-Speech Settings"/></h3>}
					autoScrollBodyContent={true}
					open={this.state.showLanguageSettings}
					actions={actionsTextToSpeechDialog}
					onRequestClose={this.handleLanguage.bind(this, false)}>
					<TextToSpeechSettings
						rate={this.state.speechRate}
						pitch={this.state.speechPitch}
						lang={this.state.ttsLanguage}
						newTtsSettings={this.handleNewTextToSpeech} />
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
