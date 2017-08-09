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
			defaultPrefLanguage: UserPreferencesStore.getPrefLang(),
			defaultText:['Enter a valid URL', 'Login Failed! Try Again',
			'Some error occurred! Try Again','Please check your internet connection',
			'Enter a valid Email Address','Minimum 6 characters required','Login to SUSI',
			'Email','Password','Login','Forgot Password?','Sign Up','Chat Anonymously']
		};
		this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
        this.customServerMessage = '';
	}

	changeLanguage= (defaultText) => {
        console.log(defaultText);
        this.setState({
            defaultText:defaultText
        })
    }
    componentDidMount(){
        let defaultPrefLanguage = this.state.defaultPrefLanguage;
        let defaultText = this.state.defaultText;
        console.log(defaultText)
        let urlForTranslate = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en-US&tl='
        +defaultPrefLanguage+'&dt=t&q='+defaultText;
        $.ajax({
          url: urlForTranslate,
          dataType: 'json',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (data) {
          	console.log(data[0]);
            if(data[0]){
              if(data[0][0]){
                defaultText = data[0][0][0];
                console.log(defaultText);
                defaultText = defaultText.split(',');
                console.log(defaultText);
                this.changeLanguage(defaultText);
              }
            }
          }.bind(this),
          error: function(errorThrown){
            console.log(errorThrown);
          }
        });
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
					if(response.accepted){
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
					}
					else {
						let state = this.state;
						state.msg = this.state.defaultText[1];
						this.setState(state);
					}
				}.bind(this),
				error: function ( jqXHR, textStatus, errorThrown) {
			        let msg = '';
			        let jsonValue =  jqXHR.status;
			        if (jsonValue === 404) {
		              msg = this.state.defaultText[1];
			 	       }
			        else {
    	              msg = this.state.defaultText[2];
			        }
			        if (status === 'timeout') {
			          msg = this.state.defaultText[3];
			        }
			        let state = this.state;
			        state.msg = msg;
			        this.setState(state);
				}.bind(this)
			});
		}
	}
	handleForgotPassword = () => {
		this.props.handleForgotPassword();
	}
	handleSignUp = () => {
		this.props.handleSignUp();
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
            this.customServerMessage = this.state.defaultText[0];
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
			this.emailErrorMessage = this.state.defaultText[4];
		}
		else {
			this.emailErrorMessage = '';
		}

        if (this.state.passwordError) {
            this.passwordErrorMessage
                = this.state.defaultText[5];
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
	render() {

		const styles = {
			'width': '100%',
			'textAlign': 'center',
			'padding': '10px'
		}
		const fieldStyle={
			'width':'256px'
		}
	    const underlineFocusStyle= {
			color: '#4285f4'
	    }
		return (
			<div className="loginForm">
				<Paper zDepth={0} style={styles}>
					<h3>{this.state.defaultText[6]}</h3>
					<form onSubmit={this.handleSubmit}>
						<div>
							<TextField name="email"
								value={this.state.email}
								onChange={this.handleChange}
								underlineFocusStyle={underlineFocusStyle}
      							floatingLabelFocusStyle={underlineFocusStyle}
								errorText={this.emailErrorMessage}
								floatingLabelText={this.state.defaultText[7]} />
						</div>
						<div>
					        <PasswordField
						        name='password'
								style={fieldStyle}
						        value={this.state.password}
								underlineFocusStyle={underlineFocusStyle}
      							floatingLabelFocusStyle={underlineFocusStyle}
								onChange={this.handleChange}
								errorText={this.passwordErrorMessage}
								floatingLabelText={this.state.defaultText[8]} />
						</div>
						<div>
                <CustomServer
                    checked={this.state.checked}
                    serverUrl={this.state.serverUrl}
                    customServerMessage={this.customServerMessage}
                    onServerChange={this.handleServeChange}/>
            </div>
						<span style={{
							margin: '3px 0'
						}}>{this.state.msg}</span>
						<div>
							<RaisedButton
								label={this.state.defaultText[9]}
								type="submit"
								backgroundColor={
									UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
								labelColor="#fff"
								disabled={!this.state.validForm}
								style={{margin:'15px 0 '}}/>
						</div>
						<span
						style={{
							margin: '8px 0',
							display:'block'
						}}
						className="forgotpwdlink"
							onClick={this.handleForgotPassword}>
								{this.state.defaultText[10]}
						</span>
						<div>
							<RaisedButton
									label={this.state.defaultText[11]}
									onClick={this.handleSignUp}
									backgroundColor={
										UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
									labelColor="#fff" />
						</div>
						<h4 style={{
							margin: '2px 0'
						}}>OR</h4>
						<div>
							<Link to={'/logout'} >
								<RaisedButton
									label={this.state.defaultText[12]}
									backgroundColor={
										UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
									labelColor="#fff" />
							</Link>
						</div>
					</form>
				</Paper>
			</div>);

	};
}

Login.propTypes = {
	history: PropTypes.object,
	handleForgotPassword: PropTypes.func,
	handleSignUp:PropTypes.func
};


export default Login;
