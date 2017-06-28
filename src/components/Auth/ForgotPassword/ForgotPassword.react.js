import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './ForgotPassword.css';
import $ from 'jquery';
import PropTypes from 'prop-types'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';

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

	handleCancel = () => {
		this.props.history.push('/', { showLogin: false });
		window.location.reload();
	}

	handleClose = () => {
		let state = this.state;
		if (state.success) {
			this.props.history.push('/', { showLogin: true });
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

	handleChange = (event) => {
		let email;
        let serverUrl;
        let state = this.state;
		if (event.target.name === 'email') {
			email = event.target.value.trim();
			let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
			state.email = email;
			state.validEmail = validEmail;
			state.emailError = !(validEmail && email);
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

        if(state.emailError){
        	if (!state.email) {
				this.emailErrorMessage = 'This Field Is Required';
			}
			else if (!state.validEmail) {
				this.emailErrorMessage = 'Invalid Email';
			}
        }
		else{
			this.emailErrorMessage = '';
		}

        if (state.serverFieldError) {
        	this.customServerMessage
        	= 'Enter a valid URL';
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
					state.success = true;
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

		const serverURL = <TextField name="serverUrl"
							onChange={this.handleChange}
							errorText={this.customServerMessage}
							floatingLabelText="Custom URL" />;
		const hidden = this.state.checked ? serverURL : '';

		const radioButtonStyles = {
		  block: {
		    maxWidth: 250,
		  },
		  radioButton: {
		    marginBottom: 16,
		  },
		};

		const styles = {
			'margin': '60px auto',
			'padding': '10px',
			'textAlign': 'center'
		}
		const actions =
			<FlatButton
				label="OK"
				backgroundColor={
					UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
				labelStyle={{ color: '#fff' }}
				onTouchTap={this.handleClose}
			/>;

		return (
			<div className="forgotPwdForm">
				<Paper zDepth={1} style={styles}>
					<h1>Forgot Password?</h1>
					<form onSubmit={this.handleSubmit}>
						<div>
							<TextField
								name="email"
								floatingLabelText="Email"
								errorText={this.emailErrorMessage}
								value={this.state.email}
								onChange={this.handleChange} />
						</div>
						<br/>
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
								type="submit"
								label="Reset"
								backgroundColor={
									UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
								labelColor="#fff"
								disabled={!this.state.validForm} />
						</div>
					</form>
					<br/>
					<RaisedButton
				      label="Cancel"
				      backgroundColor={
				        UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
				      labelColor="#fff"
				      keyboardFocused={true}
				      onTouchTap={this.handleCancel}
				    />
				</Paper>
				{this.state.msg && (
					<div><Dialog
						actions={actions}
						modal={false}
						open={true}
						onRequestClose={this.handleClose}
					>
						{this.state.msg}
					</Dialog></div>
				)
				}
			</div>
		);
	};
}

ForgotPassword.propTypes = {
	history: PropTypes.object
};

export default ForgotPassword;
