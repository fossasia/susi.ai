import React, { Component } from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ExpandingSearchField from './SearchField.react'
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import Popover from 'material-ui/Popover';
import Toggle from 'material-ui/Toggle';
import { Link } from 'react-router-dom';
import Settings from 'material-ui/svg-icons/action/settings';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import SignUp from 'material-ui/svg-icons/action/account-circle';
import Edit from 'material-ui/svg-icons/image/edit';
import susiWhite from '../../images/susi-logo-white.png';
import Info from 'material-ui/svg-icons/action/info';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Chat from 'material-ui/svg-icons/communication/chat';
import Translate from '../Translate/Translate.react';

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

	constructor(props) {
		super(props);
		this.state = {
			showOptions: false,
			anchorEl: null,
		};
	}

	showOptions = (event) => {
	  event.preventDefault();
	  this.setState({
	    showOptions: true,
	    anchorEl: event.currentTarget,
	  });
	}

	closeOptions = () => {
	  this.setState({
	    showOptions: false,
	  });
	};

	componentDidMount() {

		this.setState({
	      search: false,
	    });

		// Check Logged in
		if (cookies.get('loggedIn')) {
			Logged = (props) => (
			<div>
				<IconButton
					{...props}
					iconStyle={{ fill: 'white' }}
					onTouchTap={this.showOptions}>
					<MoreVertIcon />
				</IconButton>
				<Popover
					{...props}
					style={{marginLeft:'-25px'}}
					open={this.state.showOptions}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					onRequestClose={this.closeOptions}
				>
					<MenuItem primaryText={<Translate text="About"/>}
					containerElement={<Link to="/overview" />}
					rightIcon={<Info/>}
					/>
					<MenuItem primaryText={<Translate text="Chat"/>}
						containerElement={<Link to="/" />}
						rightIcon={<Chat/>}
					/>
					<MenuItem
						rightIcon={<Dashboard/>}
						href="https://skills.susi.ai"
					><Translate text="Skills"/>
					</MenuItem>
					<MenuItem primaryText={<Translate text="Settings"/>}
						containerElement={<Link to="/settings" />}
						rightIcon={<Settings/>}/>
					<MenuItem primaryText={<Translate text="Themes"/>}
						key="custom"
						onClick={this.props.handleThemeChanger}
						rightIcon={<Edit/>}/>
					<MenuItem primaryText={<Translate text="Logout"/>}
						containerElement={<Link to="/logout" />}
						rightIcon={<Exit />}/>
				</Popover>
			</div>
		)
		return <Logged />
		}

		// If Not Logged In
		Logged = (props) => (
			<div>
				<IconButton
					{...props}
					iconStyle={{ fill: 'white' }}
					onTouchTap={this.showOptions}>
					<MoreVertIcon />
				</IconButton>
				<Popover
					{...props}
					style={{marginLeft:'-25px'}}
					open={this.state.showOptions}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					onRequestClose={this.closeOptions}
				>
					<MenuItem primaryText={<Translate text="About"/>}
					containerElement={<Link to="/overview" />}
					rightIcon={<Info/>}
					/>
					<MenuItem primaryText={<Translate text="Chat"/>}
					containerElement={<Link to="/" />}
					rightIcon={<Chat/>}
					/>
					<MenuItem
						rightIcon={<Dashboard/>}
						href="https://skills.susi.ai"
					><Translate text="Skills"/>
					</MenuItem>
					<MenuItem primaryText={<Translate text="Settings"/>}
						containerElement={<Link to="/settings" />}
						rightIcon={<Settings/>} />
					<MenuItem primaryText={<Translate text="Login"/>}
						onTouchTap={this.props.handleOpen}
					rightIcon={<SignUp/>} />
				</Popover>
			</div>
		)
		return <Logged />
	}

	render() {

		const toggleStyles = {
			toggle: {
				margin: '7px',
				width: '160px',
				height: '30px'
			}
		};

		var backgroundCol=this.props.header;

		let appBarClass = 'app-bar';
		if (this.props.search) {
			appBarClass = 'app-bar-search';
		};

		let logoStyle = {
		    height: '25px',
		    display: 'block',
		};

		return (
			<Toolbar
				className={appBarClass}
				style={{
					backgroundColor: backgroundCol,
					height: '46px'
				}}>
				<ToolbarGroup>
				<div style={{ float: 'left', marginTop: '0px' }}>
						<img src={susiWhite} alt="susi-logo" style={logoStyle} />
				</div>
				</ToolbarGroup>
				<ToolbarGroup lastChild={true}>
					<div style={{ marginTop: '-7px' }}>
						<ExpandingSearchField
							searchText={this.props.searchState.searchText}
							searchIndex={this.props.searchState.searchIndex}
							searchCount={this.props.searchState.scrollLimit}
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
								iconStyle={{ fill: 'white' }}
								onTouchTap={this.props.handleOptions}>
								<MoreVertIcon />
							</IconButton>
							<Popover
								open={this.props.searchState.open}
								anchorEl={this.props.searchState.anchorEl}
								anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
								targetOrigin={{ horizontal: 'right', vertical: 'top' }}
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
	header:PropTypes.string,
};

export default TopBar;
