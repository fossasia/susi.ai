import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
import Translate from '../Translate/Translate.react';
import styled from 'styled-components';
import CircleImage from '../CircleImage/CircleImage';
import { bindActionCreators } from 'redux';
import uiActions from '../../redux/actions/ui';
import Link from '../shared/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SignUpIcon from '@material-ui/icons/AccountCircle';
import Settings from '@material-ui/icons/Settings';
import Exit from '@material-ui/icons/ExitToApp';
import susiWhite from '../../images/susi-logo-white.png';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import TopMenu from './TopMenu';
import LeftMenu from './LeftMenu';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Popper from './Popper';

import {
  StyledIconButton,
  UserDetail,
  SusiLogo,
  FlexContainer,
} from '../shared/TopBarStyles';

const BurgerMenuContainer = styled.div`
  display: none;
  margin-right: 0.5rem;
  @media (max-width: 800px) {
    display: block;
  }
`;

const TopRightMenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
`;

const StyledDrawer = styled(({ className, ...props }) => (
  <Drawer {...props} classes={{ paper: className }} />
))`
  width: 10rem;
`;

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
    avatarImgThumbnail: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  handleDrawerToggle = () => {
    this.setState(prevState => ({ drawerOpen: !prevState.drawerOpen }));
  };

  handleLogin = () => {
    const { actions } = this.props;
    actions.openModal({ modalType: 'login' });
  };

  render() {
    const {
      showPageTabs,
      accessToken,
      email,
      userName,
      avatarImgThumbnail,
      history,
    } = this.props;
    const { drawerOpen } = this.state;

    const Logged = props => (
      <React.Fragment>
        {accessToken && (
          <Link to="/settings">
            <MenuItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Settings" />
              </ListItemText>
            </MenuItem>
          </Link>
        )}
        {accessToken ? (
          <Link to="/logout">
            <MenuItem>
              <ListItemIcon>
                <Exit />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Logout" />
              </ListItemText>
            </MenuItem>
          </Link>
        ) : (
          // <div style={{width: '6.5rem'}}>
          <MenuItem onClick={this.handleLogin}>
            <ListItemIcon>
              <SignUpIcon />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Login" />
            </ListItemText>
          </MenuItem>
          // </div>
        )}
      </React.Fragment>
    );

    let userAvatar = null;
    if (accessToken) {
      userAvatar = avatarImgThumbnail;
    }
    return (
      <div>
        <CssBaseline />
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
              <TopRightMenuContainer>
                {accessToken && (
                  <StyledIconButton onClick={() => history.push('/settings')}>
                    <FlexContainer>
                      <CircleImage
                        name="User Avatar"
                        src={userAvatar}
                        size="32"
                      />
                      <UserDetail>{!userName ? email : userName}</UserDetail>
                    </FlexContainer>
                  </StyledIconButton>
                )}
                <div data-tip="custom" data-for={'right-menu'}>
                  <Popper
                    id={'right-menu'}
                    place="bottom"
                    effect="solid"
                    delayHide={200}
                    type={'light'}
                  >
                    <Paper style={{ position: 'absolute', right: '-2rem' }}>
                      <Logged />
                    </Paper>
                  </Popper>
                  <IconButton aria-haspopup="true" color="inherit">
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </TopRightMenuContainer>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <StyledDrawer open={drawerOpen} onClose={this.handleDrawerToggle}>
          <LeftMenu handleDrawerClose={this.handleDrawerToggle} />
        </StyledDrawer>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { email, accessToken, isAdmin, avatarImgThumbnail } = store.app;
  const { userName } = store.settings;
  return {
    email,
    accessToken,
    userName,
    isAdmin,
    avatarImgThumbnail,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StaticAppBar),
);
