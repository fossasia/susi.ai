import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ExpandingSearchField from './SearchField.react';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import Popover from 'material-ui/Popover';
import { Link } from 'react-router-dom';
import Settings from 'material-ui/svg-icons/action/settings';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import SignUp from 'material-ui/svg-icons/action/account-circle';
import susiWhite from '../../images/susi-logo-white.png';
import Info from 'material-ui/svg-icons/action/info';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import List from 'material-ui/svg-icons/action/list';
import Chat from 'material-ui/svg-icons/communication/chat';
import Extension from 'material-ui/svg-icons/action/extension';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Translate from '../Translate/Translate.react';
import CircleImage from '../CircleImage/CircleImage';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import $ from 'jquery';
import './TopBar.css';
import urls from '../../utils/urls';
import { isProduction, getAvatarProps } from '../../utils/helperFunctions';

const cookieDomain = isProduction() ? '.susi.ai' : '';

const cookies = new Cookies();
let Logged = props => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton iconStyle={{ fill: 'white' }}>
        <MoreVertIcon />
      </IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  />
);

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      showAdmin: false,
      anchorEl: null,
    };
  }

  showOptions = event => {
    event.preventDefault();
    this.setState({
      showOptions: true,
      anchorEl: event.currentTarget,
    });
  };

  closeOptions = () => {
    this.setState({
      showOptions: false,
    });
  };

  componentDidMount() {
    this.setState({
      search: false,
    });

    let url;

    if (cookies.get('loggedIn')) {
      url = `${
        urls.API_URL
      }/aaa/showAdminService.json?access_token=${cookies.get('loggedIn')}`;
      $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonpCallback: 'pfns',
        jsonp: 'callback',
        crossDomain: true,
        success: function(newResponse) {
          let showAdmin = newResponse.showAdmin;
          cookies.set('showAdmin', showAdmin, {
            path: '/',
            domain: cookieDomain,
          });
          this.setState({
            showAdmin: showAdmin,
          });
          // console.log(newResponse.showAdmin)
        }.bind(this),
        error: function(newErrorThrown) {
          console.log(newErrorThrown);
        },
      });

      this.setState({
        showAdmin: cookies.get('showAdmin'),
      });
    }
    // Check Logged in
    if (cookies.get('loggedIn')) {
      Logged = props => (
        <div>
          <IconButton
            {...props}
            iconStyle={{ fill: 'white' }}
            onTouchTap={this.showOptions}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            {...props}
            animated={false}
            style={{
              float: 'right',
              position: 'unset',
              left: 'unset',
              marginTop: '47px',
              marginRight: '8px',
            }}
            open={this.state.showOptions}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            onRequestClose={this.closeOptions}
          >
            <MenuItem
              primaryText={<Translate text="Dashboard" />}
              rightIcon={<Assessment />}
              href={`${urls.SKILL_URL}/dashboard`}
            />
            <MenuItem
              primaryText={<Translate text="Chat" />}
              containerElement={<Link to="/" />}
              rightIcon={<Chat />}
            />
            <MenuItem rightIcon={<Dashboard />} href={urls.SKILL_URL}>
              <Translate text="Skills" />
            </MenuItem>
            <MenuItem
              primaryText={<Translate text="Botbuilder" />}
              rightIcon={<Extension />}
              href={`${urls.SKILL_URL}/botbuilder`}
            />
            <MenuItem
              primaryText={<Translate text="Settings" />}
              containerElement={<Link to="/settings" />}
              rightIcon={<Settings />}
            />
            <MenuItem
              primaryText={<Translate text="About" />}
              containerElement={<Link to="/overview" />}
              rightIcon={<Info />}
            />
            {this.state.showAdmin === true ? (
              <MenuItem
                primaryText={<Translate text="Admin" />}
                rightIcon={<List />}
                href={`${urls.ACCOUNT_URL}/admin`}
              />
            ) : null}
            <MenuItem
              primaryText={<Translate text="Logout" />}
              containerElement={<Link to="/logout" />}
              rightIcon={<Exit />}
            />
          </Popover>
        </div>
      );
      return <Logged />;
    }

    // If Not Logged In
    Logged = props => (
      <div>
        <IconButton
          {...props}
          iconStyle={{ fill: 'white' }}
          onTouchTap={this.showOptions}
        >
          <MoreVertIcon />
        </IconButton>
        <Popover
          {...props}
          animated={false}
          style={{
            float: 'right',
            position: 'unset',
            left: 'unset',
            marginTop: '47px',
            marginRight: '8px',
          }}
          open={this.state.showOptions}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.closeOptions}
        >
          <MenuItem
            primaryText={<Translate text="Chat" />}
            containerElement={<Link to="/" />}
            rightIcon={<Chat />}
          />
          <MenuItem rightIcon={<Dashboard />} href={urls.SKILL_URL}>
            <Translate text="Skills" />
          </MenuItem>
          <MenuItem
            primaryText={<Translate text="About" />}
            containerElement={<Link to="/overview" />}
            rightIcon={<Info />}
          />
          <MenuItem
            primaryText={<Translate text="Login" />}
            onTouchTap={this.props.handleOpen}
            rightIcon={<SignUp />}
          />
        </Popover>
      </div>
    );
    return <Logged />;
  }

  render() {
    const backgroundCol = this.props.header;

    let appBarClass = 'app-bar';
    if (this.props.search) {
      appBarClass = 'app-bar-search';
    }

    let logoStyle = {
      height: '25px',
      display: 'block',
    };

    const isLoggedIn = !!cookies.get('loggedIn');
    let avatarProps = null;
    if (isLoggedIn) {
      avatarProps = getAvatarProps(cookies.get('emailId'));
    }

    return (
      <Toolbar
        className={appBarClass}
        style={{
          backgroundColor: backgroundCol,
          height: '46px',
        }}
      >
        <ToolbarGroup>
          <div style={{ float: 'left', marginTop: '0px', outline: '0' }}>
            <Link to="/" style={{ outline: '0' }}>
              <img src={susiWhite} alt="susi-logo" style={logoStyle} />
            </Link>
          </div>
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
          <div style={{ marginTop: '-7px' }}>
            {this.props.searchState ? (
              <ExpandingSearchField
                searchText={this.props.searchState.searchText}
                searchIndex={this.props.searchState.searchIndex}
                open={this.props.search}
                searchCount={this.props.searchState.scrollLimit}
                onTextChange={this.props.searchTextChanged}
                activateSearch={this.props._onClickSearch}
                exitSearch={this.props._onClickExit}
                scrollRecent={this.props._onClickRecent}
                scrollPrev={this.props._onClickPrev}
              />
            ) : null}
          </div>
          <div>
            {isLoggedIn && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <CircleImage {...avatarProps} size="24" />
                <label
                  className="useremail"
                  style={{
                    color: 'white',
                    marginRight: '5px',
                    fontSize: '16px',
                  }}
                >
                  {UserPreferencesStore.getUserName() === '' ||
                  UserPreferencesStore.getUserName() === 'undefined'
                    ? cookies.get('emailId')
                    : UserPreferencesStore.getUserName()}
                </label>
              </div>
            )}
          </div>
          <Logged />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

Logged.muiName = 'IconMenu';

TopBar.propTypes = {
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
  header: PropTypes.string,
};

function mapStateToProps({ app }) {
  return {
    app,
  };
}

export default connect(
  mapStateToProps,
  null,
)(TopBar);
