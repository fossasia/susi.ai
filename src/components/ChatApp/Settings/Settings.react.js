import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
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
import * as Actions from '../../../actions/';
import HardwareComponent from '../HardwareComponent';
import CustomServer from '../CustomServer.react';
import ChangePassword from '../../Auth/ChangePassword/ChangePassword.react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Popover from 'material-ui/Popover';
import { Link } from 'react-router-dom';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import SignUpIcon from 'material-ui/svg-icons/action/account-circle';
import SignUp from '../../Auth/SignUp/SignUp.react';
import Login from '../../Auth/Login/Login.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import susiWhite from '../../../images/susi-logo-white.png';
import Info from 'material-ui/svg-icons/action/info';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Chat from 'material-ui/svg-icons/communication/chat';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import './Settings.css';
import $ from 'jquery';

const cookies = new Cookies();

let Logged = (props) => (
    <div>
        <MenuItem primaryText="About"
        containerElement={<Link to="/overview" />}
        rightIcon={<Info/>}
        />
        <MenuItem primaryText="Chat"
        containerElement={<Link to="/" />}
        rightIcon={<Chat/>}
        />
        <MenuItem
        rightIcon={<Dashboard/>}
        ><a
        style={{
            color: 'rgba(0, 0, 0, 0.87)',
            width: '140px',
            display:'block'
        }}
        href="http://skills.susi.ai">Skills</a>
        </MenuItem>
        <MenuItem primaryText="Settings"
        containerElement={<Link to="/settings" />}
        rightIcon={<SettingsIcon/>} />
        <MenuItem
        primaryText="Login"
        onTouchTap={this.handleLogin}
        rightIcon={<SignUpIcon/>} />
    </div>
)

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
			voiceList: MessageStore.getTTSVoiceList(),
            defaultText:['About','Chat', 'Skills','Logout','Login','Settings','Select Theme',
            'Custom URL','Use Custom Server','Cancel','OK','Chat Settings',
            'ChatApp Settings','Default Theme','Enter As Send',
            'Send message by pressing ENTER','Mic Input','Speech Settings',
            'Speech Output','Speech Output Always ON','Language'
            ,'Select Language','Server Settings','Select backend server for the app'
            ,'Account Settings','Change Password','Server Settings','Connect to SUSI Hardware'
            ,'Save','Change Server','Please login again to change SUSI server','Light','Dark',
            'Mic Settings','Enable speech output only for speech input',
            'Enable speech output regardless of input type','Custom Theme',
            'Select A Language','Enable mic to give voice input', 'Language Settings',
            'ADD ADDRESS TO CONNECT TO HARDWARE']
		};

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
  	changeLanguage= (defaultText) => {
  		console.log(defaultText);
        this.setState({
            defaultText:defaultText
        })
    }
  	componentWillUnmount() {
    	MessageStore.removeChangeListener(this._onChange.bind(this));
  	}
  	_onChange() {
  	  this.setState({
  	  	voiceList: MessageStore.getTTSVoiceList()
  	  });
  	}

  	componentDidMount() {
  		MessageStore.addChangeListener(this._onChange.bind(this));

  		this.setState({
	      search: false,
	    });

		let defaultPrefLanguage = this.state.PrefLanguage;
		let defaultText = this.state.defaultText;
        let defaultText1 = this.state.defaultText.slice(0,18);
        let defaultText2 = this.state.defaultText.slice(18,this.state.defaultText.length);
        let urlForTranslate = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en-US&tl='
        +defaultPrefLanguage+'&dt=t&q='+defaultText1;
        $.ajax({
          url: urlForTranslate,
          dataType: 'json',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (data) {
          	if(data[0]){
              if(data[0][0]){
                defaultText1 = data[0][0][0];
                defaultText1 = defaultText1.split(',');
                console.log(defaultText1);
              }
            }
            console.log(defaultText2);
          	let urlForTranslate2 = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en-US&tl='
          	+defaultPrefLanguage+'&dt=t&q='+defaultText2;
          	$.ajax({
          	  url: urlForTranslate2,
          	  dataType: 'json',
          	  crossDomain: true,
          	  timeout: 3000,
          	  async: false,
          	  success: function (data2) {
          	    if(data2[0]){
          	      if(data2[0][0]){
          	        defaultText2 = data2[0][0][0];
          	        defaultText2 = defaultText2.split(',');
          	        defaultText = defaultText1.concat(defaultText2);
          	        this.changeLanguage(defaultText);
          	      }
          	    }
          	  }.bind(this),
          	  error: function(errorThrown){
          	    console.log(errorThrown);
          	  }
          	});
          }.bind(this),
          error: function(errorThrown){
            console.log(errorThrown);
          }
        });

        	// Check Logged in
			if (cookies.get('loggedIn')) {
				Logged = (props) => (
					<div>
						<MenuItem primaryText={this.state.defaultText[0]}
							containerElement={<Link to="/overview" />}
							rightIcon={<Info/>}
						/>
						<MenuItem primaryText={this.state.defaultText[1]}
							containerElement={<Link to="/" />}
							rightIcon={<Chat/>}
						/>
						<MenuItem
							rightIcon={<Dashboard/>}
							href="http://skills.susi.ai"
						>{this.state.defaultText[2]}
						</MenuItem>
						<MenuItem primaryText={this.state.defaultText[5]}
							containerElement={<Link to="/settings" />}
							rightIcon={<SettingsIcon/>}/>
						<MenuItem primaryText={this.state.defaultText[3]}
							containerElement={<Link to="/logout" />}
							rightIcon={<Exit />}/>
					</div>
				)
				return <Logged />
			}

			Logged = (props) => (
				<div>
					<MenuItem primaryText={this.state.defaultText[0]}
						containerElement={<Link to="/overview" />}
						rightIcon={<Info/>}
					/>
					<MenuItem primaryText={this.state.defaultText[1]}
						containerElement={<Link to="/" />}
						rightIcon={<Chat/>}
					/>
					<MenuItem
						rightIcon={<Dashboard/>}
						href="http://skills.susi.ai"
					>{this.state.defaultText[2]}
					</MenuItem>
					<MenuItem primaryText={this.state.defaultText[5]}
						containerElement={<Link to="/settings" />}
						rightIcon={<SettingsIcon/>} />
					<MenuItem
						primaryText={this.state.defaultText[4]}
						onTouchTap={this.handleLogin}
						rightIcon={<SignUpIcon/>} />
				</div>
				)
				return <Logged />
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
		console.log(voiceOutput);
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

		const serverDialogActions = [
    <RaisedButton
      key={'Cancel'}
      label={this.state.defaultText[9]}
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
      label={this.state.defaultText[10]}
      backgroundColor={
        UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={false}
      onTouchTap={this.handleServerToggle.bind(this,true)}
    />];

		let hardwareDivStyle = {
			paddingTop:'55px'
		};
		if(cookies.get('loggedIn')){
			hardwareDivStyle = {};
		}

		let backgroundCol;
		let topBackground = UserPreferencesStore.getTheme();
    switch(topBackground){
      case 'light':{
        backgroundCol = '#4285f4';
        break;
      }
      case 'dark':{
        backgroundCol =  '#19324c';
        break;
      }
      default: {
          // do nothing
      }
    }

		let TopRightMenu = (props) => (
			<div>
				<IconMenu
					{...props}
					iconButtonElement={
						<IconButton
							iconStyle={{ fill: 'white' }}><MoreVertIcon /></IconButton>
					}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
					onTouchTap={this.showOptions}
				>
				</IconMenu>
				<Popover
					{...props}
					style={{ float: 'right', position: 'relative', right: '0px', margin: '46px 20px 0 0' }}
					open={this.state.showOptions}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					onRequestClose={this.closeOptions}
				>
					<Logged />
				</Popover>
			</div>
		);
		let voiceOutput = this.populateVoiceList();
		return (
			<div className={topBackground}>
				<header className='message-thread-heading'
				style={{ backgroundColor: backgroundCol }}>
				<AppBar
						className='topAppBar'
						title={<div style={{ float: 'left', marginTop: '-10px' }}><Link to="/" >
									<img src={susiWhite} alt="susi-logo" className="siteTitle" /></Link></div>}
						style={{backgroundColor: backgroundCol, height: '46px',
										boxShadow: 'none' }}
						iconStyleRight={{marginTop: '-2px'}}
						iconElementRight={<TopRightMenu />}
				/>
				</header>
			<div className="settingsForm">
				<Paper zDepth={0}>
					<div className='settingsDialog'>
          <h3 className='settingsHeader'>{this.state.defaultText[11]}</h3>
          <h3 style={subHeaderStyle}>{this.state.defaultText[12]}</h3>
          <div>
            <h4 style={{float:'left'}}>{this.state.defaultText[6]}</h4>
            <DropDownMenu
              label='Default Theme'
              value={this.state.theme}
              onChange={this.handleSelectChange}>
              <MenuItem value={'light'} primaryText={this.state.defaultText[31]} />
              <MenuItem value={'dark'} primaryText={this.state.defaultText[32]} />
              <MenuItem value={'custom'} primaryText={this.state.defaultText[36]} />
            </DropDownMenu>
            </div>
            <div>
              <h4 style={{'marginBottom':'0px'}}>{this.state.defaultText[14]}</h4>
              <Toggle
                className='settings-toggle'
                label={this.state.defaultText[15]}
                onToggle={this.handleEnterAsSend}
                toggled={this.state.enterAsSend}/>
            </div>
            <h3 style={subHeaderStyle}>{this.state.defaultText[33]}</h3>
            <div>
              <h4 style={{'marginBottom':'0px'}}>{this.state.defaultText[18]}</h4>
              <Toggle
                className='settings-toggle'
                label={this.state.defaultText[38]}
                disabled={!this.STTBrowserSupport}
                onToggle={this.handleMicInput}
                toggled={this.state.micInput}/>
            </div>
            <h3 style={subHeaderStyle}>{this.state.defaultText[17]}</h3>
            <div>
              <h4 style={{'marginBottom':'0px'}}>{this.state.defaultText[18]}</h4>
              <Toggle
                className='settings-toggle'
                label={this.state.defaultText[34]}
                disabled={!this.TTSBrowserSupport}
                onToggle={this.handleSpeechOutput}
                toggled={this.state.speechOutput}/>
            </div>
            <div>
              <h4 style={{'marginBottom':'0px'}}>{this.state.defaultText[19]}</h4>
              <Toggle
                className='settings-toggle'
                label={this.state.defaultText[35]}
                disabled={!this.TTSBrowserSupport}
                onToggle={this.handleSpeechOutputAlways}
                toggled={this.state.speechOutputAlways}/>
            </div>
            <div>
              <h4 style={{'marginBottom':'0px'}}>{this.state.defaultText[20]}</h4>
              <FlatButton
                className='settingsBtns'
                style={Buttonstyles}
                label={this.state.defaultText[37]}
                disabled={!this.TTSBrowserSupport}
                onClick={this.handleLanguage.bind(this,true)} />
            </div>
           <div>
                <h3 style={subHeaderStyle}>{this.state.defaultText[39]}</h3>
                <div>
					<h4 style={{'marginBottom':'0px'}}>{this.state.defaultText[21]}</h4>
					<DropDownMenu
						value={voiceOutput.voiceLang}
						disabled={!this.TTSBrowserSupport}
						onChange={this.handlePrefLang}>
					 	{voiceOutput.voiceMenu}
				 </DropDownMenu>
				</div>
             </div>
            {cookies.get('loggedIn') ?
              <div>
                <div>
                  <h3 style={subHeaderStyle}>{this.state.defaultText[25]}</h3>
                    <FlatButton
                      className='settingsBtns'
                      style={Buttonstyles}
                      label={this.state.defaultText[26]}
                      onClick={this.handleServer} />
					    	</div>
								<div>
                  <h3 style={subHeaderStyle}>{this.state.defaultText[24]}</h3>
                  <FlatButton
                    className='settingsBtns'
                    style={Buttonstyles}
                    label="Change Password"
                    onClick={this.handleChangePassword} />
                </div>
              </div>
              :
              <div>
                <h3 style={subHeaderStyle}>{this.state.defaultText[22]}</h3>
                <div style={{position: 'absolute',align:'left'}}>
                  <CustomServer
                    checked={this.state.checked}
                    serverUrl={this.state.serverUrl}
                    customServerMessage={this.customServerMessage}
                    onServerChange={this.handleServeChange}/>
                </div>
              </div>
						}
			    	<div style={hardwareDivStyle}>
			    	<h3 style={subHeaderStyle}>{this.state.defaultText[27]}:</h3>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label={this.state.defaultText[40]}
							onClick={this.handleHardware} />
			    	</div>
			    	</div>
			    	<div className='settingsSubmit'>
						<RaisedButton
							label={this.state.defaultText[28]}
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
	            <h3>{this.state.defaultText[28]}</h3>
	            Please login again to change SUSI server
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
						{/* Login */}
						<Dialog
								className='dialogStyle'
								modal={true}
								open={this.state.showLogin}
								autoScrollBodyContent={true}
								bodyStyle={bodyStyle}
								contentStyle={{ width: '35%', minWidth: '300px' }}
								onRequestClose={this.handleClose}>
								<Login {...this.props}
								handleForgotPassword={this.handleForgotPassword}
								handleSignUp={this.handleSignUp}/>
								<Close style={closingStyle} onTouchTap={this.handleClose} />
						</Dialog>
						{/* SignUp */}
						<Dialog
								className='dialogStyle'
								modal={true}
								open={this.state.showSignUp}
								autoScrollBodyContent={true}
								bodyStyle={bodyStyle}
								contentStyle={{ width: '35%', minWidth: '300px' }}
								onRequestClose={this.handleClose}>
								<SignUp {...this.props}
								onRequestClose={this.handleClose}
								onLoginSignUp={this.handleLogin}/>
								<Close style={closingStyle}
								onTouchTap={this.handleClose} />
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
			</div>
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
