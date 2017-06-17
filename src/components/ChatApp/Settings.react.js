import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SettingStore from '../../stores/SettingStore';
import * as Actions from '../../actions/';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import UserPreferencesStore from '../../stores/UserPreferencesStore';

class Settings extends Component {

	constructor(props) {
		super(props);
		let defaults = UserPreferencesStore.getPreferences();
		let defaultServer = defaults.Server;
		let defaultTheme = defaults.Theme;
		this.state = {
			theme: defaultTheme,
			server: defaultServer,
			serverUrl: '',
            serverFieldError: false,
            checked: false,
			validForm: true
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.customServerMessage = '';
	}

	handleSubmit(e){
		e.preventDefault();
		let newDefaultTheme = this.state.theme;
		let newDefaultServer = this.state.server;
		if(newDefaultServer.slice(-1)==='/'){
			newDefaultServer = newDefaultServer.slice(0,-1);
		}
		console.log(newDefaultServer);
		Actions.setDefaultTheme(newDefaultTheme);
		Actions.setDefaultServer(newDefaultServer);
		this.props.history.push('/');
		window.location.reload();
	}

	handleSelectChange(event, index, value){
		this.setState({theme:value});
	}

	handleChange(event) {
        let state = this.state;
        let serverUrl;
        if (event.target.value === 'customServer') {
        	state.checked = true;
        	state.serverFieldError = true;
        }
		else if (event.target.value === 'standardServer') {
			state.checked = false;
			state.serverFieldError = false;
			let defaults = UserPreferencesStore.getPreferences();
			let standardServerURL = defaults.StandardServer;
			state.server = standardServerURL;
		}
		else if (event.target.name === 'serverUrl'){
        	serverUrl = event.target.value;
        	let validServerUrl =
/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i
        	.test(serverUrl);
			state.server = serverUrl;
			state.serverFieldError = !(serverUrl && validServerUrl);
        }

        if (state.serverFieldError) {
        	this.customServerMessage
        	= 'Enter a valid URL';
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

		const radioButtonStyles = {
		  block: {
		    maxWidth: 250,
		  },
		  radioButton: {
		    marginBottom: 16,
		  },
		};

		const serverURL = <TextField name="serverUrl"
									onChange={this.handleChange}
									errorText={this.customServerMessage}
									floatingLabelText="Custom URL" />;
		const hidden = this.state.checked ? serverURL : '';

		return (
			<div className="loginForm">
				<Paper zDepth={0} style={styles}>
					<h1>Settings</h1>
					<form onSubmit={this.handleSubmit}>
					<div>
					<h4>Default Theme:</h4>
					<DropDownMenu
						label='Default Theme'
						value={this.state.theme}
						onChange={this.handleSelectChange}>
			          <MenuItem value={'light'} primaryText="Light" />
			          <MenuItem value={'dark'} primaryText="Dark" />
			        </DropDownMenu>
			        </div>
					<div>
					<h4>Default Server:</h4>
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
					<div>
					{hidden}
					</div>
					<div>
						<RaisedButton
							label="Set Defaults"
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

Settings.propTypes = {
	history: PropTypes.object
};

export default Settings;
