// Packages
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import $ from 'jquery';

// Components
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import { isProduction } from '../../../utils/helperFunctions';

// Static assets
import './Login.css';

const cookieDomain = isProduction() ? '.susi.ai' : '';

const cookies = new Cookies();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      serverUrl: '',
      isFilled: false,
      success: false,
      validForm: false,
      emailError: true,
      passwordError: false,
      serverFieldError: false,
      showDialog: false,
      checked: false,
      loading: false,
    };
    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    this.customServerMessage = '';
  }
  //  Close error dialog box
  handleClose = event => {
    this.setState({ showDialog: false });
  };
  // Submit the Login Form
  handleSubmit = e => {
    e.preventDefault();

    var email = this.state.email.trim();
    var password = this.state.password.trim();

    let defaults = UserPreferencesStore.getPreferences();
    let BASE_URL = defaults.Server;

    let serverUrl = this.state.serverUrl;
    if (serverUrl.slice(-1) === '/') {
      serverUrl = serverUrl.slice(0, -1);
    }
    if (serverUrl !== '') {
      BASE_URL = serverUrl;
    }

    if (!email || !password) {
      return this.state.isFilled;
    }

    let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    let loginEndPoint =
      BASE_URL +
      '/aaa/login.json?type=access-token&login=' +
      this.state.email +
      '&password=' +
      encodeURIComponent(this.state.password);

    if (email && validEmail) {
      this.setState({ loading: true });
      $.ajax({
        url: loginEndPoint,
        dataType: 'jsonp',
        jsonpCallback: 'p',
        jsonp: 'callback',
        crossDomain: true,
        success: function(response) {
          if (response.accepted) {
            cookies.set('serverUrl', BASE_URL, {
              path: '/',
              domain: cookieDomain,
            });
            let accessToken = response.access_token;
            let state = this.state;
            let time = response.valid_seconds;
            let uuid = response.uuid;
            state.isFilled = true;
            state.accessToken = accessToken;
            state.success = true;
            state.msg = response.message;
            state.time = time;
            this.setState(state);
            this.handleOnSubmit(accessToken, time, email, uuid);
          } else {
            let state = this.state;
            state.msg = 'Login Failed. Try Again';
            state.password = '';
            state.showDialog = true;
            this.setState(state);
          }
        }.bind(this),
        error: function(jqXHR, textStatus, errorThrown) {
          let msg = '';
          let jsonValue = jqXHR.status;
          if (jsonValue === 404) {
            msg = 'Login Failed. Try Again';
          } else {
            msg = 'Some error occurred. Try Again';
          }
          if (status === 'timeout') {
            msg = 'Please check your internet connection';
          }
          let state = this.state;
          state.msg = msg;
          state.password = '';
          state.showDialog = true;
          this.setState(state);
        }.bind(this),
        complete: function(jqXHR, textStatus) {
          this.setState({ loading: false });
        }.bind(this),
      });
    }
  };

  // Open Forgot Password Dialog
  handleForgotPassword = () => {
    this.props.handleForgotPassword();
  };

  // Open SignUp Dialog
  handleSignUp = () => {
    this.props.handleSignUp();
  };

  // Handle toggle between custom server and default server
  handleServeChange = event => {
    let state = this.state;
    let serverUrl;
    if (event.target.value === 'customServer') {
      state.checked = !state.checked;
      let defaults = UserPreferencesStore.getPreferences();
      state.serverUrl = defaults.StandardServer;
      state.serverFieldError = false;
    } else if (event.target.name === 'serverUrl') {
      serverUrl = event.target.value;
      // eslint-disable-next-line
      let validServerUrl = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i.test(
        serverUrl,
      );
      state.serverUrl = serverUrl;
      state.serverFieldError = !(serverUrl && validServerUrl);
    }
    this.setState(state);

    if (this.state.serverFieldError) {
      this.customServerMessage = 'Enter a valid URL';
    } else {
      this.customServerMessage = '';
    }

    if (
      this.state.emailError ||
      this.state.passwordError ||
      this.state.serverFieldError
    ) {
      this.setState({ validForm: false });
    } else {
      this.setState({ validForm: true });
    }
  };

  // Handle changes in email and password
  handleChange = event => {
    let email;
    let password;
    let state = this.state;

    if (event.target.name === 'email') {
      email = event.target.value.trim();
      let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
      state.email = email;
      state.emailError = !(email && validEmail);
    } else if (event.target.name === 'password') {
      password = event.target.value;
      state.password = password;
      state.passwordError = !password;
    }
    if (this.state.emailError) {
      this.emailErrorMessage = 'Enter a valid Email Address';
    } else {
      this.emailErrorMessage = '';
    }
    if (this.state.passwordError) {
      this.passwordErrorMessage = 'Enter a valid password';
    } else {
      this.passwordErrorMessage = '';
    }
    if (
      !state.emailError &&
      !state.passwordError &&
      !state.serverFieldError &&
      this.state.password !== '' &&
      this.state.email !== ''
    ) {
      state.validForm = true;
    } else {
      state.validForm = false;
    }
    this.setState(state);
  };

  // Set Cookies on successful Login
  handleOnSubmit = (loggedIn, time, email, uuid) => {
    let state = this.state;
    if (state.success) {
      cookies.set('loggedIn', loggedIn, {
        path: '/',
        maxAge: time,
        domain: cookieDomain,
      });
      cookies.set('emailId', this.state.email, {
        path: '/',
        maxAge: time,
        domain: cookieDomain,
      });
      cookies.set('username', UserPreferencesStore.getUserName(), {
        path: '/',
        maxAge: time,
        domain: cookieDomain,
      });
      cookies.set('uuid', uuid, {
        path: '/',
        maxAge: time,
        domain: cookieDomain,
      });
      this.props.history.push('/', { showLogin: false });
      window.location.reload();
    } else {
      this.setState({
        error: true,
        accessToken: '',
        success: false,
      });
    }
  };

  render() {
    const styles = {
      width: '100%',
      textAlign: 'center',
      padding: '10px',
    };

    const fieldStyle = {
      height: '35px',
      borderRadius: 4,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '0px 10px',
      width: '250px',
      marginTop: '10px',
    };

    const inputStyle = {
      height: '35px',
      marginBottom: '10px',
    };

    const inputpassStyle = {
      height: '35px',
      marginBottom: '10px',
      marginRight: '50px',
      width: '90%',
      right: '4px',
    };

    const actions = (
      <RaisedButton
        label="OK"
        backgroundColor={
          UserPreferencesStore.getTheme() === 'light' ? '#4285f4' : '#19314B'
        }
        labelStyle={{ color: '#fff' }}
        onTouchTap={this.handleClose}
      />
    );
    return (
      <div className="loginForm">
        <Paper zDepth={0} style={styles}>
          <div>
            <Translate text="Log into SUSI" />
          </div>

          <form onSubmit={this.handleSubmit}>
            <div>
              <TextField
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                style={fieldStyle}
                inputStyle={inputStyle}
                placeholder="Email"
                underlineStyle={{ display: 'none' }}
                errorText={this.emailErrorMessage}
              />
            </div>

            <div>
              <PasswordField
                name="password"
                style={fieldStyle}
                inputStyle={inputpassStyle}
                value={this.state.password}
                placeholder="Password"
                underlineStyle={{ display: 'none' }}
                onChange={this.handleChange}
                errorText={this.passwordErrorMessage}
                visibilityButtonStyle={{
                  marginTop: '-3px',
                }}
                visibilityIconStyle={{
                  marginTop: '-3px',
                }}
                textFieldStyle={{ padding: '0px' }}
              />
            </div>

            <RaisedButton
              label={
                !this.state.loading ? <Translate text="Log In" /> : undefined
              }
              type="submit"
              backgroundColor={
                UserPreferencesStore.getTheme() === 'light'
                  ? '#4285f4'
                  : '#19314B'
              }
              labelColor="#fff"
              disabled={!this.state.validForm}
              style={{ width: '275px', margin: '10px 0px' }}
              icon={
                this.state.loading ? <CircularProgress size={24} /> : undefined
              }
            />

            <div className="login-links-section">
              <span className="fgtpwd" onClick={this.handleForgotPassword}>
                <Translate text="Forgot Password?" />
              </span>
              <span className="signUp" onClick={this.handleSignUp}>
                <Translate text="Sign up for SUSI" />
              </span>
            </div>
          </form>
        </Paper>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.showDialog}
          onRequestClose={this.handleClose}
        >
          {this.state.msg}
        </Dialog>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object,
  handleForgotPassword: PropTypes.func,
  handleSignUp: PropTypes.func,
};

export default Login;
