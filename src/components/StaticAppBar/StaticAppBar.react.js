import React, { Component } from 'react';
import { Link as _Link } from 'react-router-dom';
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
import styled, { css } from 'styled-components';
import CircleImage from '../CircleImage/CircleImage';
import Info from '@material-ui/icons/Info';
import { bindActionCreators } from 'redux';
import uiActions from '../../redux/actions/ui';
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
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const Link = styled(_Link)`
  color: #000;
  text-decoration: none;
  &:hover {
    color: #000;
  }
`;

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
  padding: 0px 25px 7px;
  font: 500;
  margin: 0 2px;
  text-transform: none;
  text-decoration: none;
  word-spacing: 2px;
  vertical-align: bottom;
  color: #ffffff;
  :hover {
    color: #ffffff;
  }
  ${props =>
    props.isActive &&
    css`
      border-bottom: 2px solid #ffffff;
      font-weight: 700;
      padding: 0px 25px 12px;
    `};
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
    url: '/',
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
    <ListItem button key={link.label} component={Link} to={link.url}>
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

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

HideOnScroll.propTypes = {
  children: PropTypes.element,
};

class StaticAppBar extends Component {
  static propTypes = {
    history: PropTypes.object,
    settings: PropTypes.object,
    location: PropTypes.object,
    isAdmin: PropTypes.bool,
    accessToken: PropTypes.string,
    email: PropTypes.string,
    userName: PropTypes.string,
    app: PropTypes.string,
    actions: PropTypes.object,
    showPageTabs: PropTypes.bool,
    avatarImg: PropTypes.string,
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
    const { actions } = this.props;
    this.handleMenuClose();
    actions.openModal({ modalType: 'login' });
  };

  handleScroll = event => {
    let scrollTop = event.srcElement.body.scrollTop,
      itemTranslate = scrollTop > 60;
    if (itemTranslate) {
      this.handleMenuClose();
    }
  };

  render() {
    const {
      showPageTabs,
      accessToken,
      email,
      userName,
      isAdmin,
      avatarImg,
    } = this.props;
    const { anchorEl, drawerOpen } = this.state;
    const open = Boolean(anchorEl);
    // Check the path to show or not to show top bar left menu

    const Logged = props => (
      <div>
        {accessToken && (
          <Link to="/skills/dashboard">
            <MenuItem onClick={this.handleMenuClose}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Dashboard" />
              </ListItemText>
            </MenuItem>
          </Link>
        )}

        <Link to="/chat">
          <MenuItem>
            <ListItemIcon>
              <Chat />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Chat" />
            </ListItemText>
          </MenuItem>
        </Link>
        <Link to="/skills">
          <MenuItem onClick={this.handleMenuClose}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Skills" />
            </ListItemText>
          </MenuItem>
        </Link>
        {accessToken && (
          <div>
            <Link to="/skills/botbuilder">
              <MenuItem onClick={this.handleMenuClose}>
                <ListItemIcon>
                  <Extension />
                </ListItemIcon>
                <ListItemText>
                  <Translate text="Botbuilder" />
                </ListItemText>
              </MenuItem>
            </Link>
            <Link to="/settings">
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
        <Link to="/">
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
          <Link to="/admin">
            <MenuItem onClick={this.handleMenuClose}>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Admin" />
              </ListItemText>
            </MenuItem>
          </Link>
        ) : null}
        {accessToken ? (
          <Link to="/logout">
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

    let userAvatar = null;
    if (accessToken) {
      userAvatar = avatarImg;
    }
    return (
      <div>
        <HideOnScroll>
          <AppBar>
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
                {showPageTabs ? <TopMenu /> : null}
              </FlexContainer>
              <div>
                <div onScroll={this.handleScroll}>
                  <TopRightMenuContainer>
                    <div>
                      {accessToken && (
                        <FlexContainer>
                          <CircleImage src={userAvatar} size="32" />
                          <UserDetail>
                            {!userName ? email : userName}
                          </UserDetail>
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
                      transitionDuration={0}
                    >
                      <MenuItem key="placeholder" style={{ display: 'none' }} />
                      <Logged />
                    </Menu>
                  </TopRightMenuContainer>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Drawer open={drawerOpen} onClose={this.handleDrawerToggle}>
          <List>{menuLinks}</List>
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { email, accessToken, isAdmin, avatarImg } = store.app;
  const { userName } = store.settings;
  return {
    email,
    accessToken,
    userName,
    isAdmin,
    avatarImg,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StaticAppBar);
