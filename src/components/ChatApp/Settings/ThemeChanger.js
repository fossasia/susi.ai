import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import Translate from '../../Translate/Translate.react';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import TextField from 'material-ui/TextField';
import { Col, Row } from 'react-flexbox-grid';
import Toggle from 'material-ui/Toggle';
import ColorPicker from 'material-ui-color-picker';
import * as Actions from '../../../actions/';
import $ from 'jquery';
import PropTypes from 'prop-types';
import PreviewThemeChat from './PreviewThemeChat';

function getStateFromStores() {
  let themeValue = [];
  let backgroundValue = [];
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
    showBodyBackgroundImage: false,
    showMessageBackgroundImage: false,
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
  { id: 1, component: 'pane', name: 'Change Background' },
  { id: 2, component: 'header', name: 'Chat Header' },
  { id: 3, component: 'body', name: 'Chat Body' },
  { id: 4, component: 'composer', name: 'Message Composer' },
  { id: 5, component: 'textarea', name: 'User Textarea' },
  { id: 6, component: 'button', name: 'User Button' },
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
      state.header = color;
      this.customTheme.header = state.header.substring(1);
    } else if (name === 'body') {
      state.body = color;
      this.customTheme.body = state.body.substring(1);
    } else if (name === 'pane') {
      state.pane = color;
      this.customTheme.pane = state.pane.substring(1);
    } else if (name === 'composer') {
      state.composer = color;
      this.customTheme.composer = state.composer.substring(1);
    } else if (name === 'textarea') {
      state.textarea = color;
      this.customTheme.textarea = state.textarea.substring(1);
    } else if (name === 'button') {
      state.button = color;
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
    let hex = this.state.textarea;
    hex = hex.slice(1);

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    const r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  };

  handleRestoreDefaultThemeClick = () => {
    this.props.onRequestClose()();
    const prevTheme = this.state.prevThemeSettings.currTheme;
    let currTheme = this.state.currTheme;
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

  handleClickColorBox = id => {
    $('#colorPicker' + id).click();
  };
  showMessageBackgroundImageToggle = () => {
    let isInputChecked = !this.state.showMessageBackgroundImage;
    this.setState({ showMessageBackgroundImage: isInputChecked });
    this.handleRemoveUrlMessage();
  };

  render() {
    let buttonColor;
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
          <Row style={{ marginBottom: '15px' }}>
            <Col xs={12} md={6} lg={6}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '18px',
                    paddingTop: '12px',
                    fontWeight: '400',
                    color: 'rgba(0,0,0,.85)',
                  }}
                >
                  {component.name}
                </div>
                {component.id === 1 && (
                  <div style={{ marginTop: '-1px' }}>
                    <span
                      className="toggle-label-right"
                      onClick={this.showMessageBackgroundImageToggle}
                    >
                      Color
                    </span>
                    <Toggle
                      label="Image"
                      labelPosition="right"
                      labelStyle={{
                        width: 'auto',
                        fontSize: '14px',
                        fontWeight: '300',
                      }}
                      defaultToggled={this.state.showMessageBackgroundImage}
                      onToggle={this.showMessageBackgroundImageToggle}
                      style={{
                        textAlign: 'right',
                        marginTop: '10px',
                        display: 'inline-block',
                        width: 'auto',
                      }}
                      thumbSwitchedStyle={{
                        backgroundColor: 'rgb(66, 133, 245)',
                      }}
                      trackSwitchedStyle={{
                        backgroundColor: 'rgba(151, 184, 238, 0.85)',
                      }}
                    />
                  </div>
                )}
              </div>
            </Col>
            <Col xs={12} md={6} lg={6} style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {component.id !== 1 && (
                  <div className="color-picker-wrap">
                    <span
                      className="color-box"
                      onClick={() => this.handleClickColorBox(component.id)}
                      style={{
                        backgroundColor: this.state[component.component],
                      }}
                    />
                    <div className="colorPicker">
                      <ColorPicker
                        className="color-picker"
                        style={{ display: 'inline-block', width: '60px' }}
                        name="color"
                        id={'colorPicker' + component.id}
                        defaultValue={this.state[component.component]}
                        onChange={color =>
                          this.handleChangeComplete(component.component, color)
                        }
                      />
                    </div>
                  </div>
                )}
                {component.id === 1 &&
                  !this.state.showMessageBackgroundImage && (
                    <div className="color-picker-wrap">
                      <span
                        className="color-box"
                        onClick={() => this.handleClickColorBox(component.id)}
                        style={{
                          backgroundColor: this.state[component.component],
                        }}
                      />
                      <div className="colorPicker">
                        <ColorPicker
                          className="color-picker"
                          style={{ display: 'inline-block', width: '60px' }}
                          name="color"
                          id={'colorPicker' + component.id}
                          defaultValue={this.state[component.component]}
                          onChange={color =>
                            this.handleChangeComplete(
                              component.component,
                              color,
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                {component.id === 1 &&
                  this.state.showMessageBackgroundImage && (
                    <div className="image-div">
                      <TextField
                        name="messageImg"
                        style={{
                          width: '180px',
                          display:
                            component.component === 'pane' ? 'block' : 'none',
                        }}
                        onChange={(e, value) =>
                          this.handleChangeMessageBackgroundImage(value)
                        }
                        value={this.state.messageBackgroundImage}
                        floatingLabelText={
                          <span style={{ fontSize: 'unset' }}>
                            Message Image URL
                          </span>
                        }
                      />
                    </div>
                  )}
              </div>
            </Col>
          </Row>
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
        contentStyle={{
          minWidth: '300px',
          maxWidth: 'unset',
          width: '780px',
        }}
        onRequestClose={this.props.onRequestClose()}
      >
        <div
          style={{
            display: 'flex',
            padding: '10px',
            height: '550px',
            justifyContent: 'space-evenly',
          }}
        >
          <div className="settingsComponents">{components}</div>
          <div
            style={{
              width: '60%',
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
        </div>
        <Close style={closingStyle} onTouchTap={this.props.onRequestClose()} />
      </Dialog>
    );
  }
}

ThemeChanger.propTypes = {
  themeOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default ThemeChanger;
