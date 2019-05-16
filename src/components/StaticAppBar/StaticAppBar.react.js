import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toolbar from '@material-ui/core/Toolbar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import Translate from '../Translate/Translate.react';
import styled from 'styled-components';
import CircleImage from '../CircleImage/CircleImage';
import Info from '@material-ui/icons/Info';
import urls from '../../utils/urls';
import { getAvatarProps } from '../../utils/helperFunctions';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SignUpIcon from '@material-ui/icons/AccountCircle';
import Settings from '@material-ui/icons/Settings';
import Chat from '@material-ui/icons/Chat';
import Dashboard from '@material-ui/icons/Dashboard';
import Exit from '@material-ui/icons/ExitToApp';
import susiWhite from '../../images/susi-logo-white.png';
import Extension from '@material-ui/icons/Extension';
import Assessment from '@material-ui/icons/Assessment';
import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';
import BlogIcon from '@material-ui/icons/ChromeReaderMode';
import DevicesIcon from '@material-ui/icons/Devices';
import InfoIcon from '@material-ui/icons/Info';
import SupportIcon from '@material-ui/icons/Face';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BurgerMenuContainer = styled.div`
  display: none;
  margin-right: 0.5rem;
  @media (max-width: 800px) {
    display: block;
  }
`;

const NavLinkContainer = styled.div`
  display: block;
  @media (max-width: 800px) {
    display: none;
  }
`;

const NavLink = styled.a`
  padding: 0px 25px ${props => (props.isActive ? '12px' : '7px')};
  font: ${props => (props.isActive ? '700' : '500')} 14px Roboto, sans-serif;
  margin: 0 2px;
  text-transform: none;
  text-decoration: none;
  word-spacing: 2px;
  color: ${props => (props.isActive ? '#fff' : '#f2f2f2')};
  vertical-align: bottom;
  border-bottom: ${props => (props.isActive ? '2px solid #fff' : '0px')};
`;

const UserDetail = styled.label`
  color: white;
  margin-right: 5px;
  @media (max-width: 1000px) {
    display: None;
  }
`;

const TopRightMenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -8px;
  margin-top: 1px;
`;

const SusiLogo = styled.img`
  height: 1.5rem;
  display: block;
`;

const topLinks = [
  {
    label: 'Overview',
    url: '/overview',
    icon: <InfoIcon />,
  },
  {
    label: 'Devices',
    url: '/devices',
    icon: <DevicesIcon />,
  },
  {
    label: 'Blog',
    url: '/blog',
    icon: <BlogIcon />,
  },
  {
    label: 'Team',
    url: '/team',
    icon: <PeopleIcon />,
  },
  {
    label: 'Support',
    url: '/support',
    icon: <SupportIcon />,
  },
];

const navLinks = topLinks.map((link, index) => {
  return (
    <NavLink
      isActive={window.location.pathname === link.url}
      key={link.label}
      href={link.url}
    >
      {link.label}
    </NavLink>
  );
});

const menuLinks = topLinks.map(link => {
  return (
    <ListItem button key={link.label}>
      <ListItemIcon>{link.icon}</ListItemIcon>
      <ListItemText primary={link.label} />
    </ListItem>
  );
});

const TopMenu = () => (
  <div style={{ marginLeft: '2rem' }}>
    <NavLinkContainer>{navLinks}</NavLinkContainer>
  </div>
);

class StaticAppBar extends Component {
  static propTypes = {
    history: PropTypes.object,
    settings: PropTypes.object,
    location: PropTypes.object,
    closeVideo: PropTypes.func,
    onRequestOpenLogin: PropTypes.func,
    isAdmin: PropTypes.bool,
    accessToken: PropTypes.string,
    email: PropTypes.string,
    userName: PropTypes.string,
    app: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      drawerOpen: false,
    };
  }

  handleDrawerToggle = () => {
    this.setState(prevState => ({ drawerOpen: !prevState.drawerOpen }));
  };

  handleMenuClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleLogin = () => {
    const { onRequestOpenLogin, location, closeVideo } = this.props;
    if (location.pathname === 'overview') {
      closeVideo();
    }
    this.handleMenuClose();
    onRequestOpenLogin();
  };

  handleScroll = event => {
    let scrollTop = event.srcElement.body.scrollTop,
      itemTranslate = scrollTop > 60;
    if (itemTranslate) {
      this.handleMenuClose();
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
    const { accessToken, email, userName, isAdmin } = this.props.app;
    const { anchorEl, drawerOpen } = this.state;
    const open = Boolean(anchorEl);
    // Check the path to show or not to show top bar left menu

    const Logged = props => (
      <div>
        {accessToken && (
          <a
            href={`${urls.SKILL_URL}/dashboard`}
            style={{ textDecoration: 'none' }}
          >
            <MenuItem>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Dashboard" />
              </ListItemText>
            </MenuItem>
          </a>
        )}

        <Link to="/" style={{ textDecoration: 'none' }}>
          <MenuItem>
            <ListItemIcon>
              <Chat />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Chat" />
            </ListItemText>
          </MenuItem>
        </Link>
        <a href={`${urls.SKILL_URL}`} style={{ textDecoration: 'none' }}>
          <MenuItem onClick={this.handleMenuClose}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Skills" />
            </ListItemText>
          </MenuItem>
        </a>
        {accessToken && (
          <div>
            <a
              href={`${urls.SKILL_URL}/botbuilder`}
              style={{ textDecoration: 'none' }}
            >
              <MenuItem onClick={this.handleMenuClose}>
                <ListItemIcon>
                  <Extension />
                </ListItemIcon>
                <ListItemText>
                  <Translate text="Botbuilder" />
                </ListItemText>
              </MenuItem>
            </a>
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <MenuItem onClick={this.handleMenuClose}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText>
                  <Translate text="Settings" />
                </ListItemText>
              </MenuItem>
            </Link>
          </div>
        )}
        <Link to="/overview" style={{ textDecoration: 'none' }}>
          <MenuItem onClick={this.handleMenuClose}>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText>
              <Translate text="About" />
            </ListItemText>
          </MenuItem>
        </Link>
        {isAdmin ? (
          <a
            href={`${urls.ACCOUNT_URL}/admin`}
            style={{ textDecoration: 'none' }}
          >
            <MenuItem onClick={this.handleMenuClose}>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Admin" />
              </ListItemText>
            </MenuItem>
          </a>
        ) : null}
        {accessToken ? (
          <Link to="/logout" style={{ textDecoration: 'none' }}>
            <MenuItem onClick={this.handleMenuClose}>
              <ListItemIcon>
                <Exit />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Logout" />
              </ListItemText>
            </MenuItem>
          </Link>
        ) : (
          <MenuItem onClick={this.handleLogin}>
            <ListItemIcon>
              <SignUpIcon />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Login" />
            </ListItemText>
          </MenuItem>
        )}
      </div>
    );

    let avatarProps = null;
    if (accessToken) {
      avatarProps = getAvatarProps(email);
    }
    return (
      <div>
        <AppBar position="static">
          <Toolbar className="app-bar" variant="dense">
            <FlexContainer>
              <BurgerMenuContainer>
                <IconButton
                  aria-label="Menu"
                  color="inherit"
                  onClick={this.handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </BurgerMenuContainer>
              <div>
                <Link to="/" style={{ outline: '0' }}>
                  <SusiLogo src={susiWhite} alt="susi-logo" />
                </Link>
              </div>
              <TopMenu />
            </FlexContainer>
            <div>
              <div onScroll={this.handleScroll}>
                <TopRightMenuContainer>
                  <div>
                    {accessToken && (
                      <FlexContainer>
                        <CircleImage {...avatarProps} size="32" />
                        <UserDetail>{!userName ? email : userName}</UserDetail>
                      </FlexContainer>
                    )}
                  </div>
                  <IconButton
                    aria-owns={open ? 'menu-popper' : undefined}
                    aria-haspopup="true"
                    color="inherit"
                    onClick={this.handleMenuClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="menu-popper"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleMenuClose}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    getContentAnchorEl={null}
                  >
                    <MenuItem key="placeholder" style={{ display: 'none' }} />
                    <Logged />
                  </Menu>
                </TopRightMenuContainer>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer open={drawerOpen} onClose={this.handleDrawerToggle}>
          <List>{menuLinks}</List>
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    app: store.app,
  };
}

export default connect(
  mapStateToProps,
  null,
)(StaticAppBar);
