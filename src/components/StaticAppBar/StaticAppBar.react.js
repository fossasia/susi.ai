import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Translate from '../Translate/Translate.react';
import CircleImage from '../CircleImage/CircleImage';
import Info from 'material-ui/svg-icons/action/info';
import actions from '../../redux/actions/app';
import urls from '../../utils/urls';
import { getAvatarProps } from '../../utils/helperFunctions';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SignUpIcon from 'material-ui/svg-icons/action/account-circle';
import Settings from 'material-ui/svg-icons/action/settings';
import Chat from 'material-ui/svg-icons/communication/chat';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import susiWhite from '../../images/susi-logo-white.png';
import Extension from 'material-ui/svg-icons/action/extension';
import Assessment from 'material-ui/svg-icons/action/assessment';
import List from 'material-ui/svg-icons/action/list';
import './StaticAppBar.css';

const baseUrl = window.location.protocol + '//' + window.location.host + '/';

const styles = {
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
  circleImageWrapperStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleImageStyle: {
    color: 'white',
    marginRight: '5px',
    fontSize: '16px',
  },
  popOverStyle: {
    float: 'right',
    position: 'relative',
    marginTop: '47px',
    marginRight: '8px',
  },
  linkLabelStyle: {
    borderBottom: '2px solid #fff',
    padding: '0px 25px 12px 25px',
    margin: '0 2px',
    color: '#fff',
    textDecoration: 'none',
    font: '700 14px Roboto,sans-serif',
    wordSpacing: '2px',
    textTransform: 'none',
    verticalAlign: 'bottom',
  },
};

class StaticAppBar extends Component {
  static propTypes = {
    history: PropTypes.object,
    settings: PropTypes.object,
    location: PropTypes.object,
    theme: PropTypes.object,
    closeVideo: PropTypes.func,
    onRequestOpenLogin: PropTypes.func,
    isAdmin: PropTypes.bool,
    accessToken: PropTypes.string,
    actions: PropTypes.object,
    email: PropTypes.string,
    userName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      isPopUpMenuOpen: false,
      showAdmin: false,
      anchorEl: null,
      isDrawerOpen: false,
    };
  }

  handleDrawerToggle = () => {
    const { isDrawerOpen } = this.state;
    this.setState({
      isDrawerOpen: !isDrawerOpen,
    });
  };

  handleDrawerClose = () => this.setState({ isDrawerOpen: false });

  showPopUpMenu = event => {
    event.preventDefault();
    this.setState({
      isPopUpMenuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  closePopUpMenu = () => {
    if (this.state.isPopUpMenuOpen) {
      this.setState({
        isPopUpMenuOpen: false,
      });
    }
  };

  handleToggle = () => this.setState({ open: !this.state.open });

  handleTitle = () => {
    this.props.history.push('/');
  };

  handleLogin = () => {
    const { onRequestOpenLogin, location, closeVideo } = this.props;
    if (location.pathname === 'overview') {
      closeVideo();
    }
    this.closePopUpMenu();
    onRequestOpenLogin();
  };

  handleScroll = event => {
    let scrollTop = event.srcElement.body.scrollTop,
      itemTranslate = scrollTop > 60;
    if (itemTranslate) {
      this.closePopUpMenu();
    }
  };

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('scroll', this.handleScroll);

    let didScroll;
    let lastScrollTop = 0;
    let delta = 5;
    let windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    let headerElement = document.getElementsByTagName('header')[0];
    const navbarHeight = headerElement.offsetHeight;

    window.addEventListener('scroll', () => {
      didScroll = true;
      if (this.mounted) {
        this.setState({ showOptions: false });
      }
    });

    const hasScrolled = () => {
      let { scrollTop } = document.scrollingElement;
      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - scrollTop) <= delta) {
        return;
      }
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is 'behind' the navbar.
      if (
        scrollTop > lastScrollTop &&
        scrollTop > navbarHeight + 400 &&
        this.mounted
      ) {
        this.setState({ scroll: 'nav-up' });
      } else if (
        scrollTop + windowHeight < document.body.scrollHeight &&
        this.mounted
      ) {
        // Scroll Down
        this.setState({ scroll: 'nav-down' });
      }
      lastScrollTop = scrollTop;
    };

    setInterval(() => {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 500);
  }

  render() {
    const {
      labelStyle,
      linkStyle,
      circleImageStyle,
      circleImageWrapperStyle,
      popOverStyle,
      linkLabelStyle,
    } = styles;
    const {
      accessToken,
      settings,
      location,
      email,
      userName,
      isAdmin,
    } = this.props;
    const { isPopUpMenuOpen, anchorEl, isDrawerOpen } = this.state;
    // Check the path to show or not to show top bar left menu
    let showLeftMenu = 'block';

    const Logged = props => (
      <div>
        {accessToken && (
          <MenuItem
            primaryText={<Translate text="Dashboard" />}
            rightIcon={<Assessment />}
            href={`${urls.SKILL_URL}/dashboard`}
          />
        )}
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
        {accessToken && (
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
        )}
        <MenuItem
          primaryText={<Translate text="About" />}
          containerElement={<Link to="/overview" />}
          rightIcon={<Info />}
        />
        {isAdmin === true ? (
          <MenuItem
            primaryText={<Translate text="Admin" />}
            rightIcon={<List />}
            href={`${urls.ACCOUNT_URL}/admin`}
          />
        ) : null}
        {accessToken ? (
          <MenuItem
            primaryText={<Translate text="Logout" />}
            containerElement={<Link to="/logout" />}
            rightIcon={<Exit />}
          />
        ) : (
          <MenuItem
            primaryText={<Translate text="Login" />}
            onClick={this.handleLogin}
            rightIcon={<SignUpIcon />}
          />
        )}
      </div>
    );

    if (location.pathname === '/settings') {
      showLeftMenu = 'none';
    }
    const TopRightMenu = props => {
      let avatarProps = null;
      if (accessToken) {
        avatarProps = getAvatarProps(email);
      }
      return (
        <div onScroll={this.handleScroll}>
          <div className="topRightMenu">
            <div>
              {accessToken && (
                <div style={circleImageWrapperStyle}>
                  <CircleImage {...avatarProps} size="32" />
                  <label className="topRightLabel" style={circleImageStyle}>
                    {!userName ? email : userName}
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
              onClick={this.showPopUpMenu}
            />
            <Popover
              {...props}
              animated={false}
              style={popOverStyle}
              open={isPopUpMenuOpen}
              anchorEl={anchorEl}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              onRequestClose={this.closePopUpMenu}
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

    const navLlinks = topLinks.map((link, index) => {
      if (location.pathname === link.url) {
        link.labelStyle = linkLabelStyle;
      }
      return (
        <Link key={index} to={link.url} style={link.labelStyle}>
          {link.label}
        </Link>
      );
    });
    const menuLlinks = topLinks.map((link, index) => {
      return (
        <MenuItem
          key={index}
          primaryText={link.label}
          className="drawerItem"
          containerElement={<Link to={link.url} />}
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
      settings && settings.theme === 'dark' ? 'rgb(25, 50, 76)' : '#4285f4';
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
            onLeftIconButtonTouchTap={this.handleDrawerToggle}
            iconStyleLeft={{ marginTop: '-2px' }}
            iconStyleRight={{ marginTop: '-2px' }}
            iconElementRight={<TopRightMenu />}
          />
        </header>
        <Drawer
          docked={false}
          width={200}
          containerStyle={{ overflow: 'hidden' }}
          open={isDrawerOpen}
          onRequestChange={isDrawerOpen => this.setState({ isDrawerOpen })}
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
            onClick={this.handleDrawerClose}
          />
          {menuLlinks}
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { app, settings } = store;
  return {
    ...app,
    ...settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StaticAppBar);
