import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './ForgotPassword.css';
import $ from 'jquery';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import CustomServer from '../../ChatApp/CustomServer.react';

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

	handleClose = () => {
		let state = this.state;
		if (state.success) {
			this.setState({
				msg: '',
			});
			this.props.showForgotPassword(false);
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

        if(this.state.emailError||
        this.state.serverFieldError){
            this.setState({validForm: false});
        }
        else{
            this.setState({validForm: true});
        }
    }

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

		const styles = {
			'width': '100%',
			'textAlign': 'center',
			'padding': '10px'
		}

		const actions =
			<FlatButton
				label="OK"
				backgroundColor={
					UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
				labelStyle={{ color: '#fff' }}
				onTouchTap={this.handleClose}
			/>;

		return (
			<div className="forgotPwdForm">
				<Paper zDepth={0} style={styles}>
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
						<div>
                            <CustomServer
                                checked={this.state.checked}
                                serverUrl={this.state.serverUrl}
                                customServerMessage={this.customServerMessage}
                                onServerChange={this.handleServeChange}/>
                        </div>
						<div>
							<RaisedButton
								type="submit"
								label="Reset"
								backgroundColor={
									UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
								labelColor="#fff"
	              				style={{margin:'25px 0 0 0 '}}
								disabled={!this.state.validForm} />
						</div>
					</form>
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
	showForgotPassword: PropTypes.func
};

export default ForgotPassword;
