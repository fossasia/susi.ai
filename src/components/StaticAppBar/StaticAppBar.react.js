import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Cookies from 'universal-cookie';
import $ from 'jquery';
import Translate from '../Translate/Translate.react';
import ForgotPassword from '../Auth/ForgotPassword/ForgotPassword.react';
import Login from '../Auth/Login/Login.react';
import SignUp from '../Auth/SignUp/SignUp.react';
import CircleImage from '../CircleImage/CircleImage';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import Info from 'material-ui/svg-icons/action/info';
import urls from '../../utils/urls';
import { getAvatarProps } from '../../utils/helperFunctions';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SignUpIcon from 'material-ui/svg-icons/action/account-circle';
import Settings from 'material-ui/svg-icons/action/settings';
import Chat from 'material-ui/svg-icons/communication/chat';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import susiWhite from '../../images/susi-logo-white.png';
import Close from 'material-ui/svg-icons/navigation/close';
import Extension from 'material-ui/svg-icons/action/extension';
import Assessment from 'material-ui/svg-icons/action/assessment';
import List from 'material-ui/svg-icons/action/list';
import './StaticAppBar.css';

const cookies = new Cookies();

const baseUrl = window.location.protocol + '//' + window.location.host + '/';

let Logged = props => (
  <div>
    <MenuItem
      primaryText="Chat"
      containerElement={<Link to="/" />}
      rightIcon={<Chat />}
    />
    <MenuItem rightIcon={<Dashboard />}>
      <a
        style={{
          color: 'rgba(0, 0, 0, 0.87)',
          width: '140px',
          display: 'block',
        }}
        href={urls.SKILL_URL}
      >
        Skills
      </a>
    </MenuItem>
    <MenuItem
      primaryText="About"
      containerElement={<Link to="/overview" />}
      rightIcon={<Info />}
    />
    <MenuItem
      primaryText="Login"
      onTouchTap={this.handleLogin}
      rightIcon={<SignUpIcon />}
    />
  </div>
);

const styles = {
  bodyStyle: {
    padding: 0,
    textAlign: 'center',
  },
  closingStyle: {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  },
  labelStyle: {
    padding: '0px 25px 7px 25px',
    font: '500 14px Roboto,sans-serif',
    margin: '0 2px',
    textTransform: 'none',
    textDecoration: 'none',
    wordSpacing: '2px',
    color: '#f2f2f2',
    verticalAlign: 'bottom',
  },
  linkStyle: {
    color: '#fff',
    height: '64px',
    textDecoration: 'none',
  },
};

class StaticAppBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      signup: false,
      open: false,
      showOptions: false,
      anchorEl: null,
      openForgotPassword: false,
    };
  }
  // Open app bar's drawer
  handleDrawer = () => this.setState({ openDrawer: !this.state.openDrawer });
  // Close app bar's drawer
  handleDrawerClose = () => this.setState({ openDrawer: false });
  // Show options on touch tap
  showOptions = event => {
    event.preventDefault();
    this.setState({
      showOptions: true,
      anchorEl: event.currentTarget,
    });
  };
  // Close options on touch tap
  closeOptions = () => {
    if (this.state.showOptions) {
      this.setState({
        showOptions: false,
      });
    }
  };

  handleToggle = () => this.setState({ open: !this.state.open });

  handleTitle = () => {
    this.props.history.push('/');
  };
  // Open login dialog and close signup dialog and options
  handleLogin = () => {
    this.setState({
      login: true,
      signup: false,
      showOptions: false,
      openForgotPassword: false,
    });
    if (this.props.location.pathname === 'overview') {
      this.props.closeVideo();
    }
  };
  // Close all dialogs and options
  handleClose = () => {
    this.setState({
      login: false,
      signup: false,
      openForgotPassword: false,
      showOptions: false,
    });
    if (this.props.location.pathname === 'overview') {
      this.props.closeVideo();
    }
  };
  // Open Signup dialog and close login dialog and options
  handleSignUp = () => {
    this.setState({
      signup: true,
      login: false,
      showOptions: false,
    });
    if (this.props.location.pathname === 'overview') {
      this.props.closeVideo();
    }
  };
  // Handle scroll events
  handleScroll = event => {
    let scrollTop = event.srcElement.body.scrollTop,
      itemTranslate = scrollTop > 60;
    if (itemTranslate) {
      this.closeOptions();
    }
  };
  // Open Forgot Password dialog and close login dialog
  handleForgotPassword = () => {
    this.setState({
      openForgotPassword: true,
      login: false,
    });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    let didScroll;
    let lastScrollTop = 0;
    let delta = 5;
    let navbarHeight = $('header').outerHeight();
    $(window).scroll(event => {
      didScroll = true;
      this.setState({ showOptions: false });
    });

    const hasScrolled = () => {
      let st = $(window).scrollTop();
      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - st) <= delta) {
        return;
      }
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight + 400) {
        // Scroll Down
        $('header')
          .removeClass('nav-down')
          .addClass('nav-up');
      } else if (st + $(window).height() < $(document).height()) {
        $('header')
          .removeClass('nav-up')
          .addClass('nav-down');
      }
      lastScrollTop = st;
    };

    setInterval(() => {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 500);

    // Return menu items for the hamburger menu
    Logged = props => (
      <div>
        {cookies.get('loggedIn') ? (
          <MenuItem
            primaryText={<Translate text="Dashboard" />}
            rightIcon={<Assessment />}
            href={`${urls.SKILL_URL}/dashboard`}
          />
        ) : null}
        <MenuItem
          primaryText={<Translate text="Chat" />}
          containerElement={<Link to="/" />}
          rightIcon={<Chat />}
        />
        <MenuItem
          primaryText={<Translate text="Skills" />}
          rightIcon={<Dashboard />}
          href={urls.SKILL_URL}
        />
        {cookies.get('loggedIn') ? (
          <div>
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
          </div>
        ) : null}
        <MenuItem
          primaryText={<Translate text="About" />}
          containerElement={<Link to="/overview" />}
          rightIcon={<Info />}
        />
        {this.props.isAdmin === true ? (
          <MenuItem
            primaryText={<Translate text="Admin" />}
            rightIcon={<List />}
            href={`${urls.ACCOUNT_URL}/admin`}
          />
        ) : null}
        {cookies.get('loggedIn') ? (
          <MenuItem
            primaryText={<Translate text="Logout" />}
            containerElement={<Link to="/logout" />}
            rightIcon={<Exit />}
          />
        ) : (
          <MenuItem
            primaryText={<Translate text="Login" />}
            onTouchTap={this.handleLogin}
            rightIcon={<SignUpIcon />}
          />
        )}
      </div>
    );
    return <Logged />;
  }

  render() {
    const { bodyStyle, closingStyle, labelStyle, linkStyle } = styles;
    // Check the path to show or not to show top bar left menu
    let showLeftMenu = 'block';

    if (this.props.location.pathname === '/settings') {
      showLeftMenu = 'none';
    }
    const TopRightMenu = props => {
      const isLoggedIn = !!cookies.get('loggedIn');
      let avatarProps = null;
      if (isLoggedIn) {
        avatarProps = getAvatarProps(cookies.get('emailId'));
      }
      return (
        <div onScroll={this.handleScroll}>
          <div className="topRightMenu">
            <div>
              {isLoggedIn && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <CircleImage {...avatarProps} size="32" />
                  <label
                    className="topRightLabel"
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
            <IconMenu
              {...props}
              iconButtonElement={
                <IconButton iconStyle={{ fill: 'white' }}>
                  <MoreVertIcon />
                </IconButton>
              }
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              onTouchTap={this.showOptions}
            />
            <Popover
              {...props}
              animated={false}
              style={{
                float: 'right',
                position: 'relative',
                marginTop: '47px',
                marginRight: '8px',
              }}
              open={this.state.showOptions}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              onRequestClose={this.closeOptions}
            >
              <Logged />
            </Popover>
          </div>
        </div>
      );
    };

    const topLinks = [
      {
        label: 'Overview',
        url: '/overview',
        style: linkStyle,
        labelStyle,
      },
      {
        label: 'Devices',
        url: '/devices',
        style: linkStyle,
        labelStyle,
      },
      {
        label: 'Blog',
        url: '/blog',
        style: linkStyle,
        labelStyle,
      },
      {
        label: 'Team',
        url: '/team',
        style: linkStyle,
        labelStyle,
      },
      {
        label: 'Support',
        url: '/support',
        style: linkStyle,
        labelStyle,
      },
    ];

    const navLlinks = topLinks.map((link, i) => {
      if (this.props.location.pathname === link.url) {
        link.labelStyle = {
          borderBottom: '2px solid #fff',
          padding: '0px 25px 12px 25px',
          margin: '0 2px',
          color: '#fff',
          textDecoration: 'none',
          font: '700 14px Roboto,sans-serif',
          wordSpacing: '2px',
          textTransform: 'none',
          verticalAlign: 'bottom',
        };
      }
      return (
        <Link key={i} to={link.url} style={link.labelStyle}>
          {link.label}
        </Link>
      );
    });
    const menuLlinks = topLinks.map((link, i) => {
      return (
        <MenuItem
          key={i}
          primaryText={link.label}
          className="drawerItem"
          containerElement={<Link to={link.url} />}
          onTouchTap={this.handleDrawerClose}
        />
      );
    });

    const TopMenu = props => (
      <div
        style={{ position: 'relative', top: '-11px', display: showLeftMenu }}
      >
        <div
          className="top-menu"
          style={{ position: 'relative', left: '46px' }}
        >
          {navLlinks}
        </div>
      </div>
    );
    const themeBackgroundColor =
      this.props.settings && this.props.settings.theme === 'dark'
        ? 'rgb(25, 50, 76)'
        : '#4285f4';
    return (
      <div>
        <header
          className="nav-down"
          style={{ backgroundColor: themeBackgroundColor }}
        >
          <AppBar
            id="headerSection"
            className="topAppBar"
            title={
              <div id="rightIconButton">
                <Link
                  to="/"
                  style={{
                    float: 'left',
                    marginTop: '-10px',
                    height: '25px',
                    width: '122px',
                  }}
                >
                  <img src={susiWhite} alt="susi-logo" className="siteTitle" />
                </Link>
                <TopMenu />
              </div>
            }
            style={{
              backgroundColor: themeBackgroundColor,
              height: '46px',
              boxShadow: 'none',
            }}
            showMenuIconButton={showLeftMenu !== 'none'}
            onLeftIconButtonTouchTap={this.handleDrawer}
            iconStyleLeft={{ marginTop: '-2px' }}
            iconStyleRight={{ marginTop: '-2px' }}
            iconElementRight={<TopRightMenu />}
          />
        </header>
        <Drawer
          docked={false}
          width={200}
          containerStyle={{ overflow: 'hidden' }}
          open={this.state.openDrawer}
          onRequestChange={openDrawer => this.setState({ openDrawer })}
        >
          <AppBar
            className="drawerAppBar"
            title={
              <div>
                <a href={baseUrl} style={{ float: 'left', marginTop: '-10px' }}>
                  <img src={susiWhite} alt="susi-logo" className="siteTitle" />
                </a>
                <TopMenu />
              </div>
            }
            style={{
              backgroundColor: '#4285f4',
              height: '46px',
              boxShadow: 'none',
            }}
            onTouchTap={this.handleDrawerClose}
          />
          {menuLlinks}
        </Drawer>
        {/* Login */}
        <Dialog
          className="dialogStyle"
          modal={true}
          open={this.state.login}
          autoScrollBodyContent={true}
          bodyStyle={bodyStyle}
          contentStyle={{ width: '35%', minWidth: '300px' }}
          onRequestClose={this.handleClose}
        >
          <Login
            {...this.props}
            handleSignUp={this.handleSignUp}
            handleForgotPassword={this.handleForgotPassword}
          />
          <Close style={closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
        {/* SignUp */}
        <Dialog
          className="dialogStyle"
          modal={true}
          open={this.state.signup}
          autoScrollBodyContent={true}
          bodyStyle={bodyStyle}
          contentStyle={{ width: '35%', minWidth: '300px' }}
          onRequestClose={this.handleClose}
        >
          <SignUp
            {...this.props}
            onRequestClose={this.handleClose}
            onLoginSignUp={this.handleLogin}
          />
          <Close style={closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
        <Dialog
          className="dialogStyle"
          modal={false}
          open={this.state.openForgotPassword}
          autoScrollBodyContent={true}
          contentStyle={{ width: '35%', minWidth: '300px' }}
          onRequestClose={this.handleClose}
        >
          <ForgotPassword
            {...this.props}
            showForgotPassword={this.showForgotPassword}
            onLoginSignUp={this.handleLogin}
          />
          <Close style={closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps({ app }) {
  return {
    isAdmin: app.isAdmin,
  };
}

StaticAppBar.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
  location: PropTypes.object,
  theme: PropTypes.object,
  closeVideo: PropTypes.func,
  isAdmin: PropTypes.bool,
};
export default connect(
  mapStateToProps,
  null,
)(StaticAppBar);
