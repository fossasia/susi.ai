import './Settings.css';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import StaticAppBar from '../../StaticAppBar/StaticAppBar.react';
import React, { Component } from 'react';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import ShareOnSocialMedia from './ShareOnSocialMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import ThemeIcon from '@material-ui/icons/InvertColors';
import VoiceIcon from '@material-ui/icons/SettingsVoice';
import ChevronRight from '@material-ui/icons/ChevronRight';
import SpeechIcon from '@material-ui/icons/RecordVoiceOver';
import AccountIcon from '@material-ui/icons/AccountBox';
import LockIcon from '@material-ui/icons/Lock';
import MyDevices from '@material-ui/icons/Devices';
import MobileIcon from '@material-ui/icons/PhoneAndroid';
import ShareIcon from '@material-ui/icons/Share';

import MicrophoneTab from './MicrophoneTab.react';
import ThemeChangeTab from './ThemeChangeTab.react';
import SpeechTab from './SpeechTab.react';
import AccountTab from './AccountTab.react';
import PasswordTab from './PasswordTab.react';
import DevicesTab from './DevicesTab.react';
import MobileTab from './MobileTab.react';
import ChatAppTab from './ChatAppTab.react';
import { bindActionCreators } from 'redux';
import settingActions from '../../../redux/actions/settings';
import { Divider } from './SettingStyles';

const menuObj = [
  { name: 'Account', icon: <AccountIcon /> },
  { name: 'Password', icon: <LockIcon /> },
  { name: 'Mobile', icon: <MobileIcon /> },
  { name: 'ChatApp', icon: <ChatIcon /> },
  { name: 'Theme', icon: <ThemeIcon /> },
  { name: 'Microphone', icon: <VoiceIcon /> },
  { name: 'Speech', icon: <SpeechIcon /> },
  { name: 'Devices', icon: <MyDevices /> },
  { name: 'Share on social media', icon: <ShareIcon /> },
];

const Container = styled.div`
  width: 100%;
  height: 117vh;
  background: ${props => (props.theme === 'dark' ? '#000012' : '#f2f2f2')};
  @media only screen and (max-width: 1060px) {
    height: 100vh;
  }
`;

const SettingContainer = styled(Paper)`
  && {
    margin-top: 20;
    text-align: center;
    display: inline-block;
    background: ${props => props.backgroundColor};
    color: ${props => props.color};
    width: 64%;

    @media only screen and (max-width: 1060px) {
      height: auto;
      width: 100%;
    }
  }
`;

class Settings extends Component {
  constructor(props) {
    super(props);
    let TTSBrowserSupport;
    if ('speechSynthesis' in window) {
      TTSBrowserSupport = true;
    } else {
      TTSBrowserSupport = false;
      console.warn(
        'The current browser does not support the SpeechSynthesis API.',
      );
    }
    this.TTSBrowserSupport = TTSBrowserSupport;
    this.state = {
      selectedSetting: 'Account',
      theme: this.props.theme,
      loading: true,
    };
  }

  componentDidMount() {
    const { accessToken, actions } = this.props;
    if (accessToken) {
      actions.getUserSettings().then(() => {
        this.setState({ loading: false, theme: this.props.theme });
      });
    }
    document.title =
      'Settings - SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  }

  // When change tab from theme
  resetThemeOnTabChange = () => {
    const { theme, customThemeValue } = this.props;
    this.setState({
      theme,
      customThemeValue: { ...customThemeValue },
    });
  };

  // Handle change to theme settings
  handleThemeChange = (event, value) => {
    this.setState({ theme: value });
  };

  loadSettings = (e, value) => {
    if (this.state.selectedSetting === 'Theme') {
      this.resetThemeOnTabChange();
    }
    this.setState({
      selectedSetting: e.target.innerText || e.target.value,
    });
  };

  generateMenu = () => {
    const { theme } = this.state;
    return menuObj.map(obj => {
      return (
        <div key={obj.name}>
          <MenuItem
            onClick={this.loadSettings}
            style={{
              color: theme === 'dark' ? '#fff' : '#272727',
            }}
            selected={this.state.selectedSetting === obj.name}
          >
            <ListItemIcon>{obj.icon}</ListItemIcon>
            <ListItemText>{obj.name}</ListItemText>
            <ListItemIcon>
              <ChevronRight />
            </ListItemIcon>
          </MenuItem>
          <Divider theme={theme} />
        </div>
      );
    });
  };

  generateDropDownMenu = () => {
    return menuObj.map(obj => {
      return (
        <MenuItem key={obj.name} value={obj.name} className="setting-item">
          {obj.name}
        </MenuItem>
      );
    });
  };

  generateSettings = () => {
    const { selectedSetting } = this.state;
    switch (selectedSetting) {
      case 'Microphone': {
        return <MicrophoneTab />;
      }
      case 'Share on social media': {
        return <ShareOnSocialMedia />;
      }
      case 'Theme': {
        return (
          <ThemeChangeTab
            handleThemeChange={this.handleThemeChange}
            theme={this.state.theme}
          />
        );
      }
      case 'Speech': {
        return <SpeechTab />;
      }
      case 'Account': {
        return <AccountTab />;
      }
      case 'Password': {
        return <PasswordTab />;
      }
      case 'Devices': {
        return <DevicesTab />;
      }
      case 'Mobile': {
        return <MobileTab />;
      }
      case 'ChatApp': {
        return <ChatAppTab />;
      }
      default:
        return null;
    }
  };

  render() {
    const { location } = this.props;
    const { selectedSetting, theme, loading } = this.state;
    const themeBackgroundColor = theme === 'dark' ? '#19324c' : '#fff';
    const themeForegroundColor = theme === 'dark' ? '#fff' : '#272727';
    let menuItems = (
      <React.Fragment>
        <div className="settings-list">
          <MenuList>{this.generateMenu()}</MenuList>
        </div>
        <div className="settings-list-dropdown">
          <Select
            onChange={this.loadSettings}
            value={selectedSetting}
            style={{ width: '100%' }}
            autoWidth={false}
          >
            {this.generateDropDownMenu()}
          </Select>
        </div>
      </React.Fragment>
    );

    return (
      <Container theme={theme}>
        <StaticAppBar location={location} />
        <div className="settingMenu">
          <Paper
            className="leftMenu"
            style={{
              backgroundColor: themeBackgroundColor,
              color: themeForegroundColor,
            }}
          >
            {menuItems}
          </Paper>
          <SettingContainer
            theme={theme}
            backgroundColor={themeBackgroundColor}
            color={themeForegroundColor}
          >
            {loading ? (
              <div className="loader-container">
                <CircularProgress size={64} />
              </div>
            ) : (
              this.generateSettings()
            )}
          </SettingContainer>
        </div>
      </Container>
    );
  }
}

Settings.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  theme: PropTypes.string,
  customThemeValue: PropTypes.object,
  accessToken: PropTypes.string,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    mapKey: store.app.apiKeys,
    theme: store.settings.theme,
    customThemeValue: store.settings.customThemeValue,
    accessToken: store.app.accessToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(settingActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
