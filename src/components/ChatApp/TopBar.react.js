import React, { Component } from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ExpandingSearchField from './SearchField.react'
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import Popover from 'material-ui/Popover';
import Toggle from 'material-ui/Toggle';
import { Link } from 'react-router-dom';

const cookies = new Cookies();

let Logged = (props) => (
	<IconMenu
		{...props}
		iconButtonElement={
			<IconButton
				iconStyle={{ fill: 'white' }}><MoreVertIcon /></IconButton>
		}
		targetOrigin={{ horizontal: 'right', vertical: 'top' }}
		anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
	>
	</IconMenu>
)

class TopBar extends Component {

	componentDidMount() {
		this.setState({
			search: false,
		});
		// Check Logged in
		if (cookies.get('loggedIn')) {
			Logged = (props) => (
				<IconMenu
					{...props}
					iconButtonElement={
						<IconButton iconStyle={{ fill: 'white' }}>
							<MoreVertIcon /></IconButton>
					}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
					>
					<MenuItem primaryText="Settings"
						onClick={this.props.handleSettings} />
					<MenuItem primaryText="Custom Theme"
						key="custom"
						onClick={this.props.handleThemeChanger} />
					<MenuItem primaryText="Change Password" onTouchTap={this.props.handleChangePassword} />
					<MenuItem primaryText="Chat Anonymously"
						containerElement={<Link to="/logout" />} />
					<MenuItem primaryText="Logout"
						containerElement={<Link to="/logout" />} />
				</IconMenu>)
			return <Logged />
		}
		// If Not Logged In
		Logged = (props) => (
			<IconMenu
				{...props}
				iconButtonElement={
					<IconButton iconStyle={{ fill: 'white' }}>
						<MoreVertIcon /></IconButton>
				}
				targetOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
			>
				<MenuItem primaryText="Settings"
					onClick={this.props.handleSettings} />
				<MenuItem primaryText="Login" onTouchTap={this.props.handleOpen} />
				<MenuItem primaryText="Sign Up" onTouchTap={this.props.handleSignUp} />
			</IconMenu>)

		return <Logged />
	}

	render() {

		const toggleStyles = {
			toggle: {
				margin: '2px',
				width: '160px',
				height: '30px'
			}
		};

		var backgroundCol;
		let topBackground = UserPreferencesStore.getTheme();
		switch (topBackground) {
			case 'light': {
				backgroundCol = '#607d8b';
				break;
			}
			case 'dark': {
				backgroundCol = '#19324c';
				break;
			}
			default: {
				// do nothing
			}
		}
		if(this.props.backgroundColor!==''){
			backgroundCol=this.props.backgroundColor;
		}
		let appBarClass = 'app-bar';
		if (this.props.search) {
			appBarClass = 'app-bar-search';
		};

		return (
			<Toolbar
				className={appBarClass}
				style={{
					backgroundColor: backgroundCol,
					height: '46px'
				}}>
				<ToolbarGroup >
				</ToolbarGroup>
				<ToolbarGroup lastChild={true}>
					<div style={{ marginTop: '-7px' }}>
						<ExpandingSearchField
							searchText={this.props.searchState.searchText}
							onTextChange={this.props.searchTextChanged}
							activateSearch={this.props._onClickSearch}
							exitSearch={this.props._onClickExit}
							scrollRecent={this.props._onClickRecent}
							scrollPrev={this.props._onClickPrev} />
					</div>
					{!this.props.search ?
						(<Logged />) :
						(<div>
							<IconButton
								tooltip="Options"
								iconStyle={{ fill: 'white' }}
								onTouchTap={this.props.handleOptions}>
								<MoreVertIcon />
							</IconButton>
							<Popover
								open={this.props.searchState.open}
								anchorEl={this.props.searchState.anchorEl}
								anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
								targetOrigin={{ horizontal: 'left', vertical: 'top' }}
								onRequestClose={this.props.handleRequestClose}
							>
								<Toggle
									label="Case Sensitive"
									style={toggleStyles.toggle}
									labelPosition="right"
									onToggle={this.props.handleToggle}
									toggled={this.props.searchState.caseSensitive}
								/>
							</Popover>
						</div>)
					}
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

Logged.muiName = 'IconMenu';

TopBar.propTypes = {
	handleSettings: PropTypes.func,
	handleThemeChanger: PropTypes.func,
	handleOpen: PropTypes.func,
	handleSignUp: PropTypes.func,
	handleChangePassword: PropTypes.func,
	handleOptions: PropTypes.func,
	handleRequestClose: PropTypes.func,
	handleToggle: PropTypes.func,
	searchTextChanged: PropTypes.func,
	_onClickSearch: PropTypes.func,
	_onClickExit: PropTypes.func,
	_onClickRecent: PropTypes.func,
	_onClickPrev: PropTypes.func,
	search: PropTypes.bool,
	searchState: PropTypes.object,
	backgroundColor:PropTypes.string,
};

export default TopBar;
