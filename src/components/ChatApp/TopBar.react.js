import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Settings from 'material-ui/svg-icons/action/settings';
import Exit from 'material-ui/svg-icons/action/exit-to-app';
import SignUp from 'material-ui/svg-icons/action/account-circle';
import Info from 'material-ui/svg-icons/action/info';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import List from 'material-ui/svg-icons/action/list';
import Share from 'material-ui/svg-icons/social/share';
import Chat from 'material-ui/svg-icons/communication/chat';
import Extension from 'material-ui/svg-icons/action/extension';
import Assessment from 'material-ui/svg-icons/action/assessment';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import susiWhite from '../../images/susi-logo-white.png';
import Translate from '../Translate/Translate.react';
import CircleImage from '../CircleImage/CircleImage';
import urls from '../../utils/urls';
import { getAvatarProps } from '../../utils/helperFunctions';
import ExpandingSearchField from './SearchField.react';
import './TopBar.css';

const styles = {
  popoverStyle: {
    float: 'right',
    position: 'unset',
    left: 'unset',
    marginTop: '47px',
    marginRight: '8px',
  },
  logoStyle: {
    height: '25px',
    display: 'block',
  },
};

class TopBar extends Component {
  static propTypes = {
    onRequestOpenLogin: PropTypes.func,
    handleSignUp: PropTypes.func,
    handleChangePassword: PropTypes.func,
    handleOptions: PropTypes.func,
    handleRequestClose: PropTypes.func,
    handleToggle: PropTypes.func,
    searchTextChanged: PropTypes.func,
    toggleShareClose: PropTypes.func,
    openSearch: PropTypes.func,
    exitSearch: PropTypes.func,
    nextSearchItem: PropTypes.func,
    previousSearchItem: PropTypes.func,
    search: PropTypes.bool,
    searchState: PropTypes.object,
    header: PropTypes.string,
    email: PropTypes.string,
    accessToken: PropTypes.string,
    userName: PropTypes.string,
    isAdmin: PropTypes.bool,
  };

  static defaultProps = {
    email: '',
    userName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      anchorEl: null,
      userName: '',
      uuid: '',
      email: '',
    };
  }

  componentDidMount() {
    this.setState({
      search: false,
    });
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

  render() {
    const { popoverStyle, logoStyle } = styles;
    const { showOptions, anchorEl } = this.state;
    const {
      searchState,
      search,
      searchTextChanged,
      exitSearch,
      openSearch,
      nextSearchItem,
      previousSearchItem,
      email,
      accessToken,
      userName,
      header,
      toggleShareClose,
      onRequestOpenLogin,
      isAdmin,
    } = this.props;

    let appBarClass = 'app-bar';
    if (search) {
      appBarClass = 'app-bar-search';
    }

    let avatarProps = null;
    if (accessToken && email) {
      avatarProps = getAvatarProps(email, accessToken);
    }

    return (
      <Toolbar
        className={appBarClass}
        style={{
          backgroundColor: header,
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
            {searchState ? (
              <ExpandingSearchField
                searchText={searchState.searchText}
                searchIndex={searchState.searchIndex}
                open={search}
                searchCount={searchState.scrollLimit}
                onTextChange={searchTextChanged}
                activateSearch={openSearch}
                exitSearch={exitSearch}
                scrollRecent={nextSearchItem}
                scrollPrev={previousSearchItem}
              />
            ) : null}
          </div>
          <div>
            {accessToken && (
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
                  {userName ? userName : email}
                </label>
              </div>
            )}
          </div>
          {/* Pop over menu */}
          <IconButton
            iconStyle={{ fill: 'white' }}
            onTouchTap={this.showOptions}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            animated={false}
            style={popoverStyle}
            open={showOptions}
            anchorEl={anchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            onRequestClose={this.closeOptions}
          >
            {accessToken && (
              <MenuItem
                onClick={this.closeOptions}
                primaryText={<Translate text="Dashboard" />}
                rightIcon={<Assessment />}
                href={`${urls.SKILL_URL}/dashboard`}
              />
            )}
            <MenuItem
              onClick={this.closeOptions}
              primaryText={<Translate text="Chat" />}
              containerElement={<Link to="/" />}
              rightIcon={<Chat />}
            />
            <MenuItem
              rightIcon={<Dashboard />}
              href={urls.SKILL_URL}
              onClick={this.closeOptions}
            >
              <Translate text="Skills" />
            </MenuItem>
            {accessToken && (
              <MenuItem
                onClick={this.closeOptions}
                primaryText={<Translate text="Botbuilder" />}
                rightIcon={<Extension />}
                href={`${urls.SKILL_URL}/botbuilder`}
              />
            )}
            {accessToken && (
              <MenuItem
                onClick={this.closeOptions}
                primaryText={<Translate text="Settings" />}
                containerElement={<Link to="/settings" />}
                rightIcon={<Settings />}
              />
            )}
            <MenuItem
              onClick={this.closeOptions}
              primaryText={<Translate text="About" />}
              containerElement={<Link to="/overview" />}
              rightIcon={<Info />}
            />

            {isAdmin && (
              <MenuItem
                primaryText={<Translate text="Admin" />}
                rightIcon={<List />}
                href={`${urls.ACCOUNT_URL}/admin`}
              />
            )}
            <MenuItem
              onClick={this.closeOptions}
              primaryText={<Translate text="Share" />}
              onTouchTap={toggleShareClose}
              rightIcon={<Share />}
            />
            {accessToken ? (
              <MenuItem
                onClick={this.closeOptions}
                primaryText={<Translate text="Logout" />}
                containerElement={<Link to="/logout" />}
                rightIcon={<Exit />}
              />
            ) : (
              <MenuItem
                onClick={this.closeOptions}
                primaryText={<Translate text="Login" />}
                onTouchTap={onRequestOpenLogin}
                rightIcon={<SignUp />}
              />
            )}
          </Popover>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

function mapStateToProps(store) {
  const { email, accessToken, userName, isAdmin } = store.app;
  return {
    email,
    accessToken,
    userName,
    isAdmin,
  };
}

export default connect(
  mapStateToProps,
  null,
)(TopBar);
