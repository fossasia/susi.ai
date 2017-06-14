import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SettingStore from '../../stores/SettingStore';
import * as Actions from '../../actions';
import PropTypes from 'prop-types';

class Settings extends Component {

	constructor(props) {
		super(props);
		this.state = {
			theme: 'light'
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e){
		e.preventDefault();
		let newDefaultTheme = this.state.theme;
		console.log(this.state);
		Actions.setDefaultTheme(newDefaultTheme);
		this.props.history.push('/');
		window.location.reload();
	}

	handleChange = (event, index, value) =>{
		this.setState({theme: value})
	};


	render() {

		const styles = {
			'textAlign': 'center',
			'padding': '10px'
		}

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
						onChange={this.handleChange}>
			          <MenuItem value={'light'} primaryText="Light" />
			          <MenuItem value={'dark'} primaryText="Dark" />
			        </DropDownMenu>
					</div>
					<div>
						<RaisedButton
							label="Set Defaults"
							type="submit"
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
