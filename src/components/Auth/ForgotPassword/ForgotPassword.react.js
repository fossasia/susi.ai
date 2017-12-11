import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import './ForgotPassword.css';
import $ from 'jquery';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import CustomServer from '../../ChatApp/CustomServer.react';
import Close from 'material-ui/svg-icons/navigation/close';
import Translate from '../../Translate/Translate.react';

class ForgotPassword extends Component {

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			msg: '',
			success: false,
			serverUrl: '',
			checked:false,
			serverFieldError: false,
			emailError: true,
			validEmail:true,
			validForm:false
		};

		this.emailErrorMessage = '';
		this.customServerMessage = '';
	}

	// Handle Closing the Forgot Password Dialog
	handleClose = () => {
		let state = this.state;
		if (state.success) {
			this.setState({
				msg: '',
			});
		}
		else {
			this.setState({
				email: '',
				msg: '',
				success: false,
				serverUrl: '',
				checked:false,
				serverFieldError: false,
				emailError: true,
				validEmail:false,
				validForm: false,
			});
		}
	};

	// Handle toggle between custom server and default server
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
			this.customServerMessage = <Translate text="Enter a valid URL"/>;
		}
		else{
			this.customServerMessage = '';
		}

		if(this.state.emailError||
		this.state.serverFieldError){
			this.setState({validForm: false});
		}
		else{
			this.setState({validForm: true});
		}
	}

	// Handle changes in email
	handleChange = (event) => {
		let email;
		let state = this.state;
		if (event.target.name === 'email') {
			email = event.target.value.trim();
			let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
			state.email = email;
			state.validEmail = validEmail;
			state.emailError = !(validEmail && email);
		}

		if(state.emailError){
			if (!state.email) {
				this.emailErrorMessage = <Translate text="This Field Is Required"/>;
			}
			else if (!state.validEmail) {
				this.emailErrorMessage = <Translate text="Invalid Email"/>;
			}
		}
		else{
			this.emailErrorMessage = '';
		}

		if (state.serverFieldError) {
			this.customServerMessage
			= <Translate text="Enter a valid URL"/>;
		}
		else{
			this.customServerMessage = '';
		}

		if (!state.emailError && !state.serverFieldError) {
			state.validForm = true;
		}
		else {
			state.validForm = false;
		}
		this.setState(state);
	};

	// Submit the Forgot Password Form
	handleSubmit = (event) => {
		event.preventDefault();

		let email = this.state.email.trim();
		let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

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
		if (email && validEmail) {
			$.ajax({
				url: BASE_URL+'/aaa/recoverpassword.json?forgotemail=' + email,
				dataType: 'jsonp',
				crossDomain: true,
				timeout: 3000,
				async: false,
				statusCode: {
					422: function() {
					  let msg = 'Email does not exist';
					  let state = this.state;
					  state.msg = msg;
					  this.setState(state);
					}
				},
				success: function (response) {
					let msg = response.message;
					let state = this.state;
					state.msg = msg;
					if(response.accepted){
							state.success = true;
					}
					else{
						state.success = false;
						state.msg += 'Please Try Again';
					}
					this.setState(state);
				}.bind(this),
				error: function (jqXHR, textStatus, errorThrown) {
					let jsonValue =  jqXHR.status;
					let msg = '';
					if (jsonValue === 404) {
					  msg = 'Email does not exist';
					}
					else {
					 msg = 'Failed. Try Again';
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

	render() {

		const styles = {
			'width': '100%',
			'textAlign': 'center',
			'padding': '10px'
		}
		const underlineFocusStyle= {
			color: '#4285f4'
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

		return (
			<div className="forgotPwdForm">
				<Paper zDepth={0} style={styles}>
					<h3><Translate text="Forgot Password ?"/></h3>
					<form onSubmit={this.handleSubmit}>
						<div>
							<TextField
								name="email"
								floatingLabelText={<Translate text="Email"/>}
								errorText={this.emailErrorMessage}
								value={this.state.email}
								underlineFocusStyle={underlineFocusStyle}
				floatingLabelFocusStyle={underlineFocusStyle}
								onChange={this.handleChange} />
						</div>
						<div>
							<CustomServer
								checked={this.state.checked}
								serverUrl={this.state.serverUrl}
								customServerMessage={this.customServerMessage}
								onServerChange={this.handleServeChange}/>
						</div>
						<div>
							{/* Reset Button */}
							<RaisedButton
								type="submit"
								label={<Translate text="Reset"/>}
								backgroundColor={
									UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
								labelColor="#fff"
								disabled={!this.state.validForm} />
						</div>
					</form>
					{/* Back to Login button */}
					<RaisedButton
						onClick={this.props.onLoginSignUp}
						label={<Translate text='Login'/>}
						backgroundColor={
						UserPreferencesStore.getTheme()==='light'
						? '#4285f4' : '#19314B'}
						labelColor="#fff"
						style={{margin:'10px 0 0 0'}} />
				</Paper>
				{this.state.msg && (
					<div><Dialog
						modal={false}
						open={true}
						onRequestClose={this.handleClose}
					>
						<Translate text={this.state.msg} />

					<Close style={closingStyle} onTouchTap={this.handleClose} />
					</Dialog></div>
				)
				}
			</div>
		);
	};
}

ForgotPassword.propTypes = {
	onLoginSignUp: PropTypes.func
};

export default ForgotPassword;
