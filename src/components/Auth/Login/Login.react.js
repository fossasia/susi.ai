import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import './Login.css';
import PasswordField from 'material-ui-password-field'
import $ from 'jquery';
import PropTypes  from 'prop-types';
import Cookies from 'universal-cookie';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import Dialog from 'material-ui/Dialog';
import CustomServer from '../../ChatApp/CustomServer.react';

const cookies = new Cookies();

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			serverUrl: '',
			isFilled: false,
			success: false,
			validForm: false,
			emailError: true,
			passwordError: false,
			serverFieldError: false,
			checked: false,
			showForgotPassword: false
		};
		this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
        this.customServerMessage = '';
	}

	handleSubmit = (e) => {
		e.preventDefault();

		var email = this.state.email.trim();
		var password = this.state.password.trim();

		let defaults = UserPreferencesStore.getPreferences();
		let BASE_URL = defaults.Server;

		let serverUrl = this.state.serverUrl;
		if(serverUrl.slice(-1) === '/'){
			serverUrl = serverUrl.slice(0,-1);
		}
		if(serverUrl !== ''){
			BASE_URL = serverUrl;
		}
		console.log(BASE_URL);

		if (!email || !password) { return this.state.isFilled; }

		let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
		let loginEndPoint =
			BASE_URL+'/aaa/login.json?type=access-token&login=' +
			this.state.email + '&password=' + encodeURIComponent(this.state.password);

		if (email && validEmail) {
			$.ajax({
				url: loginEndPoint,
				dataType: 'jsonp',
				jsonpCallback: 'p',
				jsonp: 'callback',
				crossDomain: true,
				success: function (response) {
					cookies.set('serverUrl', BASE_URL, { path: '/' });
					console.log(cookies.get('serverUrl'));
					let accessToken = response.access_token;
					let state = this.state;
					let time = response.valid_seconds;
					state.isFilled = true;
					state.accessToken = accessToken;
					state.success = true;
					state.msg = response.message;
					state.time = time;
					this.setState(state);
					this.handleOnSubmit(accessToken, time,email);
				}.bind(this),
				error: function ( jqXHR, textStatus, errorThrown) {
			        let msg = '';
			        let jsonValue =  jqXHR.status;
			        if (jsonValue === 404) {
		              msg = 'Login Failed. Try Again';
			 	       }
			        else {
    	              msg = 'Some error occurred. Try Again';
			        }
			        if (status === 'timeout') {
			          msg = 'Please check your internet connection';
			        }

			        let state = this.state;
			        state.msg = msg;
			        this.setState(state);
				}.bind(this)
			});
		}
	}

	handleServeChange = (event) => {
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

        if(this.state.emailError||
        this.state.passwordError||
        this.state.serverFieldError){
            this.setState({validForm: false});
        }
        else{
            this.setState({validForm: true});
        }
    }

	handleChange = (event) => {
		let email;
        let password;
        let state = this.state;

        if (event.target.name === 'email') {
            email = event.target.value.trim();
            let validEmail =
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
            state.email = email;
            state.emailError = !(email && validEmail)
        }
        else if (event.target.name === 'password') {
            password = event.target.value;
            let validPassword = password.length >= 6;
            state.password = password;
            state.passwordError = !(password && validPassword);
        }
		if (this.state.emailError) {
			this.emailErrorMessage = 'Enter a valid Email Address';
		}
		else {
			this.emailErrorMessage = '';
		}

        if (this.state.passwordError) {
            this.passwordErrorMessage
                = 'Minimum 6 characters required';
        }
        else{
        	this.passwordErrorMessage='';
        }

	    if (!state.emailError && !state.passwordError && !state.serverFieldError)
	    {
	    	state.validForm = true;
	    }
        else {
        	state.validForm = false;
        }

		this.setState(state);
	}

	handleOnSubmit = (loggedIn, time, email) => {
		let state = this.state;
		if (state.success) {
			cookies.set('loggedIn', loggedIn, { path: '/', maxAge: time });
			cookies.set('email', email, { path: '/', maxAge: time });
			this.props.history.push('/', { showLogin: false });
			window.location.reload();
		}
		else {
			this.setState({
				error: true,
				accessToken: '',
				success: false
			});
		}
	}

	showForgotPassword = (toShow) => {
		if(toShow){
			this.setState({
				showForgotPassword: true,
			});
		}
		else{
			this.setState({
				showForgotPassword: false,
			});
		}
	}

	render() {

		const styles = {
			'width': '100%',
			'textAlign': 'center',
			'padding': '10px'
		}
		const fieldStyle={
			'width':'256px'
		}

		const ForgotPwdAction = <RaisedButton
			label="Cancel"
			backgroundColor={
				UserPreferencesStore.getTheme()==='light' ? '#0084ff' : '#19314B'}
			labelColor="#fff"
			width='200px'
			keyboardFocused={true}
			onTouchTap={this.showForgotPassword.bind(this,false)}
	    />;

		return (
			<div className="loginForm">
				<Paper zDepth={0} style={styles}>
					<h1>Login to SUSI</h1>
					<form onSubmit={this.handleSubmit}>
						<div>
							<TextField name="email"
								value={this.state.email}
								onChange={this.handleChange}
								errorText={this.emailErrorMessage}
								floatingLabelText="Email" />
						</div>
						<div>
					        <PasswordField
						        name='password'
								style={fieldStyle}
						        value={this.state.password}

								onChange={this.handleChange}
								errorText={this.passwordErrorMessage}
								floatingLabelText='Password' />
						</div>
						<div>
                            <CustomServer
                                checked={this.state.checked}
                                serverUrl={this.state.serverUrl}
                                customServerMessage={this.customServerMessage}
                                onServerChange={this.handleServeChange}/>
                        </div>
						<div>
							<RaisedButton
								label="Login"
								type="submit"
								backgroundColor={
									UserPreferencesStore.getTheme()==='light' ? '#0084ff' : '#19314B'}
								labelColor="#fff"
								disabled={!this.state.validForm}
								style={{margin:'25px 0 0 0 '}}/>
						</div>
						<span>{this.state.msg}</span>
						<h1>OR</h1>
						<div className="forgotpwdlink"
							onClick={this.showForgotPassword}>
								<b>Forgot Password?</b>
						</div>
						<br/>
						<div>
							<Link to={'/logout'} >
								<RaisedButton
									label='Chat Anonymously'
									backgroundColor={
										UserPreferencesStore.getTheme()==='light' ? '#0084ff' : '#19314B'}
									labelColor="#fff" />
							</Link>
						</div>
					</form>
				</Paper>
				<Dialog
					className='dialogStyle'
					actions={ForgotPwdAction}
					modal={false}
					open={this.state.showForgotPassword}
					autoScrollBodyContent={true}
					contentStyle={{width: '35%',minWidth: '300px'}}
					onRequestClose={this.showForgotPassword.bind(this,false)}>
					<ForgotPassword {...this.props}
						showForgotPassword={this.showForgotPassword}/>
				</Dialog>
			</div>);

	};
}

Login.propTypes = {
	history: PropTypes.object,
	showForgotPassword: PropTypes.func,
};


export default Login;
