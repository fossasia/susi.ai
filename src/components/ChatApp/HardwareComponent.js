import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SettingStore from '../../stores/SettingStore';

class HardwareComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			serverUrl: '',
            serverFieldError: false,
            checked: false,
			validForm: true,
			open: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.customServerMessage = '';
	}

	handleSubmit(e){
		e.preventDefault();
		// Handle Hardware Logic
	}

	handleChange(event) {
        let state = this.state;
        let serverUrl;
        if (event.target.name === 'serverUrl'){
        	serverUrl = event.target.value;
        	let validServerUrl =
/(ws):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i
        	.test(serverUrl);
			state.server = serverUrl;
			state.serverFieldError = !(serverUrl && validServerUrl);
        }

        if (state.serverFieldError) {
        	this.customServerMessage
        	= 'Enter a valid Address';
        }
        else{
        	this.customServerMessage = '';
        }

    	if (!state.serverFieldError || !state.checked)
    	{
    		state.validForm = true;
    	}
        else {
        	state.validForm = false;
        }
		this.setState(state);
	};

	render() {

		const styles = {
			'textAlign': 'center',
			'padding': '10px'
		}
		return (
			<div className="loginForm">
				<Paper zDepth={0} style={styles}>
					<h1>Enter Socket Web Address</h1>
					<form onSubmit={this.handleSubmit}>
					<div>
					<TextField name="serverUrl"
									onChange={this.handleChange}
									errorText={this.customServerMessage}
									floatingLabelText="Custom URL" />
					</div>
					<div>
						<RaisedButton
							label="Connect"
							type="submit"
							disabled={!this.state.validForm}
							backgroundColor={
								SettingStore.getTheme() ? '#607D8B' : '#19314B'}
							labelColor="#fff"
						/>
					</div>
					</form>
				</Paper>
			</div>);
	}
}

HardwareComponent.propTypes = {
	history: PropTypes.object
};

export default HardwareComponent;
