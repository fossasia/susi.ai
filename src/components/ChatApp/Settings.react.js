import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

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

		this.customServerMessage = '';
	}

	handleServer = () => {
		this.props.onServerChange();
	}
	handleHardware = () => {
		this.props.onHardwareSettings();
	}

	handleSubmit = () => {
		let newTheme = this.state.theme;
		let newDefaultServer = this.state.server;
		if(newDefaultServer.slice(-1)==='/'){
			newDefaultServer = newDefaultServer.slice(0,-1);
		}
		let vals = {
			theme: newTheme,
			server: newDefaultServer
		}
		this.props.onSettingsSubmit(vals);
	}

	handleSelectChange= (event, index, value) => {
		this.setState({theme:value});
	}

	handleChange = (event) => {
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
        	this.customServerMessage = 'Enter a valid URL';
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
			'textAlign': 'left',
			'paddingLeft': '25%'
		}

		const subHeaderStyle = {
			color: UserPreferencesStore.getTheme()==='light'
								? '#607D8B' : '#19314B'
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
			<div className="settingsForm">
				<Paper zDepth={0}>
					<h1>Chat Settings</h1>
					<div style={styles}>
					<div>
					<h4 style={subHeaderStyle}>Chat Settings</h4>
						<h3 style={{float:'left'}}>Select Theme</h3>
						<DropDownMenu
							label='Default Theme'
							value={this.state.theme}
							onChange={this.handleSelectChange}>
				          <MenuItem value={'light'} primaryText="Light" />
				          <MenuItem value={'dark'} primaryText="Dark" />
				        </DropDownMenu>
			        </div>
			        {cookies.get('loggedIn') ?
			        <div>
			        <h4 style={subHeaderStyle}>Server Settings:</h4>
			        <h3 onClick={this.handleServer}
			        	style={{cursor: 'pointer'}}>
			        	Select Server<br/>
			        	<span style={{fontSize:'80%',
			        	fontWeight:'normal'
			    		}}>Select backend server for the app
			    		</span>
			    	</h3>
			    	</div>
			       	:
					<div>
						<h4 style={subHeaderStyle}>Server Settings:</h4>
						<h3>Choose Server</h3>
						<RadioButtonGroup
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
						{hidden}
					</div>
					}
			    	<div>
			    	<h4 style={subHeaderStyle}>Connect to SUSI Hardware:</h4>
			        <h3 onClick={this.handleHardware}
			        	style={{cursor: 'pointer'}}>
			        	Add address to connect to Hardware<br/>
			        	<span style={{fontSize:'80%',
			        	fontWeight:'normal'
			    		}}>
			    		</span>
			    	</h3>
			    	</div>
			    	</div>
			    	<div>
						<RaisedButton
							label="Save"
							disabled={!this.state.validForm}
							backgroundColor={
								UserPreferencesStore.getTheme()==='light'
								? '#607D8B' : '#19314B'}
							labelColor="#fff"
							onClick={this.handleSubmit}
						/>
					</div>
				</Paper>
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
