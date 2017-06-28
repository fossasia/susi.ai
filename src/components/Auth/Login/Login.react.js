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
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';

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
            passwordError: true,
            serverFieldError: false,
            checked: false
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
			this.state.email + '&password=' + this.state.password;

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
					this.handleOnSubmit(accessToken, time);
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
			        if (status == 'timeout') {
			          msg = 'Please check your internet connection';
			        }

			        let state = this.state;
			        state.msg = msg;
			        this.setState(state);
				}.bind(this)
			});
		}
	}

	handleChange = (event) => {
		let email;
        let password;
        let serverUrl;
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
        else if (event.target.value === 'customServer') {
        	state.checked = true;
        	state.serverFieldError = true;
        }
		else if (event.target.value === 'standardServer') {
			state.checked = false;
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
        if (this.state.serverFieldError) {
        	this.customServerMessage
        	= 'Enter a valid URL';
        }
        else{
        	this.customServerMessage = '';
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

	handleOnSubmit = (loggedIn, time) => {
		let state = this.state;
		if (state.success) {
			cookies.set('loggedIn', loggedIn, { path: '/', maxAge: time });
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

	render() {
		const serverURL = <TextField name="serverUrl"
							onChange={this.handleChange}
							errorText={this.customServerMessage}
							floatingLabelText="Custom URL" />;
		const hidden = this.state.checked ? serverURL : '';

		const styles = {
			'width': '100%',
			'textAlign': 'center',
			'padding': '10px'
		}
		const fieldStyle={
			'width':'256px'
		}

		const radioButtonStyles = {
		  block: {
		    maxWidth: 250,
		  },
		  radioButton: {
		    marginBottom: 16,
		  },
		};
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
							<div>
							<RadioButtonGroup style={{display: 'flex',
							  marginTop: '10px',
							  maxWidth:'200px',
							  flexWrap: 'wrap',
							  margin: 'auto'}}
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
							</div>
						</div>
						<div>
						{hidden}
						</div>
						<div>
							<RaisedButton
								label="Login"
								type="submit"
								backgroundColor={
									UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
								labelColor="#fff"
								disabled={!this.state.validForm} />
						</div>
						<span>{this.state.msg}</span>
						<h1>OR</h1>
						<div>
							<Link to='/forgotpwd'
								className="forgotpwdlink">
								<b>Forgot Password?</b>
							</Link>
						</div>
						<div>
							<Link to={'/logout'} >
								<RaisedButton
									label='Chat Anonymously'
									backgroundColor={
										UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
									labelColor="#fff" />
							</Link>
						</div>
					</form>
				</Paper>
			</div>);

	};
}

Login.propTypes = {
	history: PropTypes.object
};


export default Login;
