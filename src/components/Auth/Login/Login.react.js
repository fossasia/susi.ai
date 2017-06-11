import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import './Login.css';
import PasswordField from 'material-ui-password-field'
import $ from 'jquery';
import { PropTypes } from 'prop-types';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			isFilled: false,
			success: false,
			validForm: false,
			emailError: true,
            passwordError: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
	}

	handleSubmit(e) {
		e.preventDefault();

		var email = this.state.email.trim();
		var password = this.state.password.trim();
		if (!email || !password) { return this.state.isFilled; }

		let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
		if (email && validEmail) {
			$.ajax({
				url: 'http://api.susi.ai/aaa/login.json?type=access-token&login=' + this.state.email + '&password=' + this.state.password,
				dataType: 'jsonp',
				jsonpCallback: 'p',
				jsonp: 'callback',
				crossDomain: true,
				success: function (response) {
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
				error: function (errorThrown) {
					let msg = 'Login Failed. Try Again';
					let state = this.state;
					state.msg = msg;
					this.setState(state);
				}.bind(this)
			});
		}
	}
	handleChange(event) {
		let email;
        let password;
        let state = this.state
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
        else{
        	this.emailErrorMessage='';
        }

        if (this.state.passwordError) {
            this.passwordErrorMessage
                = 'Minimum 6 characters required';
        }
        else{
        	this.passwordErrorMessage='';
        }

        if(!state.emailError && !state.passwordError){
        	state.validForm = true;
        }
        else{
        	state.validForm = false;
        }
		this.setState(state);
	}
	handleOnSubmit(loggedIn, time) {
		let state = this.state;
		if (state.success) {
			cookies.set('loggedIn', loggedIn, { path: '/', maxAge: time });
			this.props.history.push('/',{showLogin:false});
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
		const styles = {
			'textAlign': 'center',
			'padding' : '10px'
		}

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
						        value={this.state.password}
								onChange={this.handleChange}
								errorText={this.passwordErrorMessage}
						        floatingLabelText='Password'/>
						</div>
						<div>
							<RaisedButton
								label="Login"
								type="submit"
								primary={true}
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
							<Link to={'/'} >
								<RaisedButton
									label='Chat Anonymously'
									primary={true} />
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
