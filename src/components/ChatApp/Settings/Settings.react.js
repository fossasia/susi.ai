import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Cookies from 'universal-cookie';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import TextToSpeechSettings from './TextToSpeechSettings.react';
import Close from 'material-ui/svg-icons/navigation/close';
import Back from 'material-ui/svg-icons/hardware/keyboard-backspace';
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

const cookies = new Cookies();

let Logged = (props) => (
	<IconMenu
		{...props}
		iconButtonElement={
			<IconButton
				iconStyle={{ fill: 'white' }}><MoreVertIcon /></IconButton>
		}
		targetOrigin={{ horizontal: 'right', vertical: 'top' }}
		anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
	>
	</IconMenu>
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
			showServerChangeDialog: false,
			showHardwareChangeDialog: false,
			showChangePasswordDialog: false,
			showLogin: false,
      showSignUp: false,
			showForgotPassword: false,
			showOptions: false,
			anchorEl: null,
		};

		this.customServerMessage = '';
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
			lang: newTTSLanguage,
		}

		let settings = Object.assign({}, vals);
		settings.LocalStorage = true;
		// Store in cookies for anonymous user
		cookies.set('settings',settings);
		// Trigger Actions to save the settings in stores and server
		this.implementSettings(vals);
	}

	implementSettings = (values) => {
    let currSettings = UserPreferencesStore.getPreferences();
    let settingsChanged = {};
    let resetVoice = false;
    if(currSettings.Theme !== values.theme){
      settingsChanged.Theme = values.theme;
    }
    if(currSettings.EnterAsSend !== values.enterAsSend){
      settingsChanged.EnterAsSend = values.enterAsSend;
    }
    if(currSettings.MicInput !== values.micInput){
      settingsChanged.MicInput = values.micInput;
    }
    if(currSettings.SpeechOutput !== values.speechOutput){
      settingsChanged.SpeechOutput = values.speechOutput;
      resetVoice = true;
    }
    if(currSettings.SpeechOutputAlways !== values.speechOutputAlways){
      settingsChanged.SpeechOutputAlways = values.speechOutputAlways;
      resetVoice = true;
    }
    if(currSettings.SpeechRate !== values.rate){
      settingsChanged.SpeechRate = values.rate;
    }
    if(currSettings.SpeechPitch !== values.pitch){
      settingsChanged.SpeechPitch = values.pitch;
    }
    if(currSettings.TTSLanguage !== values.lang){
      settingsChanged.TTSLanguage = values.lang;
    }
    Actions.settingsChanged(settingsChanged);
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

	closeOptions = () => {
		this.setState({
      showOptions: false,
    });
	}

	componentWillMount() {
		document.body.className = 'white-body';
  }

	componentDidMount() {

		this.setState({
	      search: false,
	    });

		// Check Logged in
		if (cookies.get('loggedIn')) {
			Logged = (props) => (
			<div>
				<IconButton
					{...props}
					iconStyle={{ fill: 'white' }}
					onTouchTap={this.showOptions}>
					<MoreVertIcon />
				</IconButton>
				<Popover
					{...props}
					style={{marginLeft:'-15px'}}
					open={this.state.showOptions}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					onRequestClose={this.closeOptions}
				>
					<MenuItem primaryText="Overview"
						containerElement={<Link to="/overview" />}
					/>
					<MenuItem primaryText="Logout"
						containerElement={<Link to="/logout" />}
						rightIcon={<Exit />}/>
				</Popover>
			</div>
		)
		return <Logged />
		}

		// If Not Logged In
		Logged = (props) => (
			<div>
				<IconButton
					{...props}
					iconStyle={{ fill: 'white' }}
					onTouchTap={this.showOptions}>
					<MoreVertIcon />
				</IconButton>
				<Popover
					{...props}
					style={{marginLeft:'-15px'}}
					open={this.state.showOptions}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					onRequestClose={this.closeOptions}
				>
					<MenuItem primaryText="Overview"
						containerElement={<Link to="/overview" />}
					/>
					<MenuItem primaryText="Login"
						onTouchTap={this.handleLogin} />
					<MenuItem primaryText="Sign Up"
						onTouchTap={this.handleSignUp}
						rightIcon={<SignUpIcon/>} />
				</Popover>
			</div>
		)
		return <Logged />
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
      label="Cancel"
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
      label="OK"
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

		return (
			<div className={topBackground}>
				<header className='message-thread-heading'
				style={{ backgroundColor: backgroundCol }}>
				<AppBar
						className='app-bar'
						style={{ backgroundColor: {backgroundCol}, height: '46px',
						boxShadow:'none' }}
						iconElementLeft={<Back style={{fill:'#fff',cursor:'pointer'}} />}
						onLeftIconButtonTouchTap={this.onRequestClose}
						iconStyleRight={{marginTop: '-2px'}}
						iconElementRight={<Logged />}
				/>
				</header>
			<div className="settingsForm">
				<Paper zDepth={0}>
					<div className='settingsDialog'>
					<h3 className='settingsHeader'>Chat Settings</h3>
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
			        	<Toggle
									className='settings-toggle'
			        		label='Send message by pressing ENTER'
			        		onToggle={this.handleEnterAsSend}
									toggled={this.state.enterAsSend}/>
			        </div>
			        <h3 style={subHeaderStyle}>Mic Settings</h3>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Mic Input</h4>
			        	<Toggle
									className='settings-toggle'
			        		label='Enable mic to give voice input'
			        		onToggle={this.handleMicInput}
									toggled={this.state.micInput}/>
			        </div>
			        <h3 style={subHeaderStyle}>Speech Settings</h3>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Speech Output</h4>
			        	<Toggle
									className='settings-toggle'
			        		label='Enable speech output only for speech input'
			        		onToggle={this.handleSpeechOutput}
									toggled={this.state.speechOutput}/>
			        </div>
			        <div>
			        	<h4 style={{'marginBottom':'0px'}}>Speech Output Always ON</h4>
			        	<Toggle
									className='settings-toggle'
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
				        <div>
					      <h3 style={subHeaderStyle}>Server Settings</h3>
								<FlatButton
									className='settingsBtns'
									style={Buttonstyles}
									label="Select backend server for the app"
									onClick={this.handleServer} />
					    	</div>
								<div>
					      <h3 style={subHeaderStyle}>Account Settings</h3>
								<FlatButton
									className='settingsBtns'
									style={Buttonstyles}
									label="Change Password"
									onClick={this.handleChangePassword} />
					    	</div>
							</div>
			       	:
							<div>
								<h3 style={subHeaderStyle}>Server Settings</h3>
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
			    	<h3 style={subHeaderStyle}>Connect to SUSI Hardware:</h3>
						<FlatButton
							className='settingsBtns'
							style={Buttonstyles}
							label="Add address to connect to Hardware"
							onClick={this.handleHardware} />
			    	</div>
			    	</div>
			    	<div className='settingsSubmit'>
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
	            <h3>Change Server</h3>
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
								handleForgotPassword={this.handleForgotPassword}/>
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
