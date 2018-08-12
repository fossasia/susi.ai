import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import Translate from '../../Translate/Translate.react';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import TextField from 'material-ui/TextField';
import { CirclePicker } from 'react-color';
import * as Actions from '../../../actions/';
import PropTypes from 'prop-types';
import PreviewThemeChat from './PreviewThemeChat';

function getStateFromStores() {
  var themeValue = [];
  var backgroundValue = [];
  // get Theme data from server
  if (UserPreferencesStore.getThemeValues()) {
    themeValue = UserPreferencesStore.getThemeValues().split(',');
  }
  if (UserPreferencesStore.getBackgroundImage()) {
    backgroundValue = UserPreferencesStore.getBackgroundImage().split(',');
  }
  return {
    currTheme: UserPreferencesStore.getTheme(),
    header: themeValue.length > 5 ? '#' + themeValue[0] : '#4285f4',
    pane: themeValue.length > 5 ? '#' + themeValue[1] : '#f5f4f6',
    body: themeValue.length > 5 ? '#' + themeValue[2] : '#fff',
    composer: themeValue.length > 5 ? '#' + themeValue[3] : '#f5f4f6',
    textarea: themeValue.length > 5 ? '#' + themeValue[4] : '#fff',
    button: themeValue.length > 5 ? '#' + themeValue[5] : '#4285f4',
    bodyBackgroundImage: backgroundValue.length > 1 ? backgroundValue[0] : '',
    messageBackgroundImage:
      backgroundValue.length > 1 ? backgroundValue[1] : '',
  };
}

const closingStyle = {
  position: 'absolute',
  zIndex: 1200,
  fill: '#444',
  width: '26px',
  height: '26px',
  right: '10px',
  top: '10px',
  cursor: 'pointer',
};

const customThemeBodyStyle = {
  padding: 0,
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
};

const componentsList = [
  { id: 1, component: 'header', name: 'Header' },
  { id: 2, component: 'pane', name: 'Message Pane' },
  { id: 3, component: 'body', name: 'Body' },
  { id: 4, component: 'composer', name: 'Composer' },
  { id: 5, component: 'textarea', name: 'Textarea' },
  { id: 6, component: 'button', name: 'Button' },
];

class ThemeChanger extends Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStores();
    this.customTheme = {
      header: this.state.header.substring(1),
      pane: this.state.pane.substring(1),
      body: this.state.body.substring(1),
      composer: this.state.composer.substring(1),
      textarea: this.state.textarea.substring(1),
      button: this.state.button.substring(1),
    };
  }

  handleColorChange = (name, color) => {
    // Current Changes
  };
  handleChangeBodyBackgroundImage = backImage => {
    this.setState({ bodyBackgroundImage: backImage });
  };

  handleChangeMessageBackgroundImage = backImage => {
    this.setState({ messageBackgroundImage: backImage });
  };

  handleRemoveUrlMessage = () => {
    if (!this.state.messageBackgroundImage) {
      this.setState({ SnackbarOpenBackground: true });
      setTimeout(() => {
        this.setState({
          SnackbarOpenBackground: false,
        });
      }, 2500);
    } else {
      this.setState({
        messageBackgroundImage: '',
      });
    }
  };

  handleRemoveUrlBody = () => {
    if (!this.state.bodyBackgroundImage) {
      this.setState({ SnackbarOpenBackground: true });
      setTimeout(() => {
        this.setState({
          SnackbarOpenBackground: false,
        });
      }, 2500);
    } else {
      this.setState({
        bodyBackgroundImage: '',
      });
      this.handleChangeBodyBackgroundImage('');
    }
  };

  handleRemoveUrlMessage = () => {
    if (!this.state.messageBackgroundImage) {
      this.setState({ SnackbarOpenBackground: true });
      setTimeout(() => {
        this.setState({
          SnackbarOpenBackground: false,
        });
      }, 2500);
    } else {
      this.setState({
        messageBackgroundImage: '',
      });
    }
  };

  // get the selected custom colour
  handleChangeComplete = (name, color) => {
    this.setState({ currTheme: 'custom' });
    let currSettings = UserPreferencesStore.getPreferences();
    let settingsChanged = {};
    if (currSettings.Theme !== 'custom') {
      settingsChanged.theme = 'custom';
      Actions.settingsChanged(settingsChanged);
    }
    // Send these Settings to Server
    let state = this.state;

    if (name === 'header') {
      state.header = color.hex;
      this.customTheme.header = state.header.substring(1);
    } else if (name === 'body') {
      state.body = color.hex;
      this.customTheme.body = state.body.substring(1);
    } else if (name === 'pane') {
      state.pane = color.hex;
      this.customTheme.pane = state.pane.substring(1);
    } else if (name === 'composer') {
      state.composer = color.hex;
      this.customTheme.composer = state.composer.substring(1);
    } else if (name === 'textarea') {
      state.textarea = color.hex;
      this.customTheme.textarea = state.textarea.substring(1);
    } else if (name === 'button') {
      state.button = color.hex;
      this.customTheme.button = state.button.substring(1);
    }
    this.setState(state);
    document.body.style.setProperty('background-color', this.state.body);
  };

  onRequestClose = () => {
    this.setState({ open: false });
  };

  invertColorTextArea = () => {
    // get the text are code
    var hex = this.state.textarea;
    hex = hex.slice(1);

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  };

  handleRestoreDefaultThemeClick = () => {
    this.props.onRequestClose()();
    var prevTheme = this.state.prevThemeSettings.currTheme;
    var currTheme = this.state.currTheme;
    if (
      (currTheme === 'custom' && prevTheme === 'dark') ||
      currTheme === 'dark'
    ) {
      this.applyDarkTheme();
    } else {
      this.applyLightTheme();
    }
  };

  saveThemeSettings = () => {
    let customData = '';
    Object.keys(this.customTheme).forEach(key => {
      customData = customData + this.customTheme[key] + ',';
    });

    let settingsChanged = {};
    settingsChanged.theme = 'custom';
    settingsChanged.customThemeValue = customData;
    if (this.state.bodyBackgroundImage || this.state.messageBackgroundImage) {
      settingsChanged.backgroundImage =
        this.state.bodyBackgroundImage +
        ',' +
        this.state.messageBackgroundImage;
    }
    Actions.settingsChanged(settingsChanged);
    this.setState({ currTheme: 'custom' });
    this.props.onRequestClose()();
  };

  render() {
    var buttonColor;
    buttonColor = this.state.button;

    const customSettingsDone = (
      <div>
        <RaisedButton
          label={<Translate text="Save" />}
          backgroundColor={buttonColor ? buttonColor : '#4285f4'}
          labelColor="#fff"
          width="200px"
          keyboardFocused={false}
          onTouchTap={this.saveThemeSettings}
          style={{ margin: '0 5px' }}
        />
        <RaisedButton
          label={<Translate text="Reset" />}
          backgroundColor={buttonColor ? buttonColor : '#4285f4'}
          labelColor="#fff"
          width="200px"
          keyboardFocused={false}
          onTouchTap={this.handleRestoreDefaultThemeClick}
          style={{ margin: '0 5px' }}
        />
      </div>
    );

    const components = componentsList.map(component => {
      return (
        <div key={component.id} className="circleChoose">
          <h4>
            <Translate text="Color of" /> <Translate text={component.name} />:
          </h4>
          <CirclePicker
            color={component}
            width={'100%'}
            colors={[
              '#f44336',
              '#e91e63',
              '#9c27b0',
              '#673ab7',
              '#3f51b5',
              '#2196f3',
              '#03a9f4',
              '#00bcd4',
              '#009688',
              '#4caf50',
              '#8bc34a',
              '#cddc39',
              '#ffeb3b',
              '#ffc107',
              '#ff9800',
              '#ff5722',
              '#795548',
              '#607d8b',
              '#0f0f0f',
              '#ffffff',
            ]}
            onChangeComplete={this.handleChangeComplete.bind(
              this,
              component.component,
            )}
            onChange={this.handleColorChange.bind(this, component.id)}
          />

          <TextField
            name="backgroundImg"
            style={{
              display: component.component === 'body' ? 'block' : 'none',
            }}
            onChange={(e, value) => this.handleChangeBodyBackgroundImage(value)}
            value={this.state.bodyBackgroundImage}
            floatingLabelText={<Translate text="Body Background Image URL" />}
          />
          <RaisedButton
            name="removeBackgroundBody"
            key={'RemoveBody'}
            label={<Translate text="Remove URL" />}
            style={{
              display: component.component === 'body' ? 'block' : 'none',
              width: '150px',
            }}
            backgroundColor={buttonColor ? buttonColor : '#4285f4'}
            labelColor="#fff"
            keyboardFocused={true}
            onTouchTap={this.handleRemoveUrlBody}
          />
          <TextField
            name="messageImg"
            style={{
              display: component.component === 'pane' ? 'block' : 'none',
            }}
            onChange={(e, value) =>
              this.handleChangeMessageBackgroundImage(value)
            }
            value={this.state.messageBackgroundImage}
            floatingLabelText={
              <Translate text="Message Background Image URL" />
            }
          />
          <RaisedButton
            name="removeBackgroundMessage"
            key={'RemoveMessage'}
            label={<Translate text="Remove URL" />}
            style={{
              display: component.component === 'pane' ? 'block' : 'none',
              width: '150px',
            }}
            backgroundColor={buttonColor ? buttonColor : '#4285f4'}
            labelColor="#fff"
            keyboardFocused={true}
            onTouchTap={this.handleRemoveUrlMessage}
          />
        </div>
      );
    });
    return (
      <Dialog
        actions={customSettingsDone}
        modal={false}
        open={this.props.themeOpen}
        autoScrollBodyContent={true}
        bodyStyle={customThemeBodyStyle}
        contentStyle={{ width: '70%', minWidth: '300px' }}
        onRequestClose={this.props.onRequestClose.bind(this)}
      >
        <div style={{ display: 'flex', padding: '10px' }}>
          <div className="settingsComponents">{components}</div>
          <div
            style={{
              width: '40%',
              position: 'fixed',
              overflow: 'hidden',
              right: '0',
              padding: '10px',
            }}
          >
            <PreviewThemeChat
              header={this.state.header}
              pane={this.state.pane}
              messageBackgroundImage={this.state.messageBackgroundImage}
              body={this.state.body}
              bodyBackgroundImage={this.state.bodyBackgroundImage}
              composer={this.state.composer}
              textarea={this.state.textarea}
              button={this.state.button}
            />
          </div>
          <Close
            style={closingStyle}
            onTouchTap={this.props.onRequestClose()}
          />
        </div>
      </Dialog>
    );
  }
}

ThemeChanger.propTypes = {
  themeOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default ThemeChanger;
