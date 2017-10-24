import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import * as Actions from '../../actions/';
import Translate from '../Translate/Translate.react';

class HardwareComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      serverUrl: '',
      serverFieldError: false,
      checked: false,
      validForm: false,
      open: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.customServerMessage = '';
  }

  handleSubmit(e) {
    e.preventDefault();
    // Handle Hardware Logic
    const serverUrl = this.state.serverUrl;
    console.log(this.state);
    console.log(serverUrl);
    if(! Actions.connectToWebSocket(serverUrl) ) {
      alert('Connection Error. Please verify that Susi Hardware is running on address you mentioned.');
    }
  }

  handleChange(event) {
    let state = this.state;
    let serverUrl;
    if (event.target.name === 'serverUrl') {
      serverUrl = event.target.value;
      let validServerUrl =
        /(ws):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i
          .test(serverUrl);
      state.serverUrl = serverUrl;
      state.serverFieldError = !(serverUrl && validServerUrl);
    }

    if (state.serverFieldError) {
      this.customServerMessage
        = 'Enter a valid Address';
    }
    else {
      this.customServerMessage = '';
    }

    if (!state.serverFieldError) {
      state.validForm = true;
    }
    else {
      state.validForm = false;
    }
    this.setState(state);
  };

  render() {
    const themeBackgroundColor=(this.props.settings && this.props.settings.theme)==='dark'?'#19324c':'#fff';
    const themeForegroundColor=(this.props.settings && this.props.settings.theme)==='dark'?'#fff':'#272727';
    const floatingLabelStyle={
            color:'#9E9E9E'
    }
    const styles = {
      'textAlign': 'left',
      'padding': '10px',
      paddingTop:'0px',
      paddingLeft: '30px',
      backgroundColor:themeBackgroundColor
    }
    const inputStyle={
            color:themeForegroundColor
    }
    const underlineFocusStyle= {
            color: '#4285f4'
    }
    const connectButtonDivStyle = {
      'marginTop': '25px',
    }

    return (
      <div className="loginForm" style={{paddingTop:'0px'}}>
        <Paper zDepth={0} style={styles}>
          <form onSubmit={this.handleSubmit}>
          <div>
          <TextField name="serverUrl"
                  onChange={this.handleChange}
                  inputStyle={inputStyle}
                  floatingLabelStyle={floatingLabelStyle}
                  floatingLabelFocusStyle={underlineFocusStyle}
                  errorText={this.customServerMessage}
                  floatingLabelText={<Translate text="Websocket URL"/>} />
          </div>
          <div style={connectButtonDivStyle}>
            <RaisedButton
              label={<Translate text="Connect"/>}
              type="submit"
              disabled={!this.state.validForm}
              backgroundColor='#4285f4'
              labelColor="#fff"
            />
          </div>
          </form>
        </Paper>
      </div>);
  }
}

HardwareComponent.propTypes = {
  history: PropTypes.object,
  settings:PropTypes.object
};

export default HardwareComponent;
