import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import './SignUp.css';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import zxcvbn from 'zxcvbn';
import Translate from '../../Translate/Translate.react';
import Recaptcha from 'react-recaptcha';
import { CAPTCHA_KEY } from '../../../config.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isEmail: false,
      emailError: true,
      passwordError: true,
      passwordConfirmError: true,
      passwordValue: '',
      confirmPasswordValue: '',
      msg: '',
      success: false,
      open: false,
      openLogin: false,
      openForgotPassword: false,
      isCaptchaVerified: false,
      validForm: false,
      serverUrl: '',
      checked: false,
      msgOpen: false,
      serverFieldError: false,
    };

    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    this.passwordConfirmErrorMessage = '';
    this.customServerMessage = '';
    this.captchaVerifyErrorMessage = '';

    if (document.cookie.split('=')[0] === 'loggedIn') {
      window.location.reload();
    }
  }

  onCaptchaLoad = () => {
    this.setState({
      isCaptchaVerified: false,
      captchaVerifyErrorMessage: '',
    });
  };

  verifyCaptchaCallback = response => {
    if (response) {
      this.setState({
        isCaptchaVerified: true,
        captchaVerifyErrorMessage: '',
      });
    }
  };

  // Handle closing the dialog
  handleClose = () => {
    let state = this.state;
    if (state.success) {
      this.setState({
        msgOpen: false,
      });
      this.props.onRequestClose();
    } else {
      this.setState({
        email: '',
        isEmail: false,
        emailError: true,
        passwordError: true,
        passwordConfirmError: true,
        isCaptchaVerified: false,
        passwordValue: '',
        passwordStrength: '',
        passwordScore: -1,
        confirmPasswordValue: '',
        msg: '',
        success: false,
        validForm: false,
        serverUrl: '',
        checked: false,
        serverFieldError: false,
        open: false,
        msgOpen: false,
      });
    }
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
      //eslint-disable-next-line
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
      this.state.passwordConfirmError ||
      this.state.serverFieldError
    ) {
      this.setState({ validForm: false });
    } else {
      this.setState({ validForm: true });
    }
  };

  // Handle changes in email, password and confirmPassword
  handleChange = event => {
    let email;
    let password;
    let confirmPassword;
    // let serverUrl;
    let state = this.state;
    if (event.target.name === 'email') {
      email = event.target.value.trim();
      let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
      state.email = email;
      state.isEmail = validEmail;
      state.emailError = !(email || validEmail);
    } else if (event.target.name === 'password') {
      password = event.target.value;
      let validPassword = password.length >= 6;
      state.passwordValue = password;
      state.passwordError = !(password && validPassword);
      state.passwordConfirmError = !(
        password === this.state.confirmPasswordValue
      );
      if (validPassword) {
        let result = zxcvbn(password);
        state.passwordScore = result.score;
        let strength = ['Worst', 'Bad', 'Weak', 'Good', 'Strong'];
        state.passwordStrength = strength[result.score];
      } else {
        state.passwordStrength = '';
        state.passwordScore = -1;
      }
    } else if (event.target.name === 'confirmPassword') {
      password = this.state.passwordValue;
      confirmPassword = event.target.value;
      let validPassword = confirmPassword === password;
      state.confirmPasswordValue = confirmPassword;
      state.passwordConfirmError = !(validPassword && confirmPassword);
    }

    this.setState(state);

    if (this.state.emailError) {
      this.emailErrorMessage = 'Enter a valid Email Address';
    } else if (this.state.passwordError) {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = 'Minimum 6 characters required';
      this.passwordConfirmErrorMessage = '';
      this.captchaVerifyErrorMessage = '';
    } else if (this.state.passwordConfirmError) {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
      this.passwordConfirmErrorMessage = 'Check your password again';
      this.captchaVerifyErrorMessage = '';
    } else if (!this.state.isCaptchaVerified) {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
      this.passwordConfirmErrorMessage = '';
      this.captchaVerifyErrorMessage = 'Please confirm you are a human';
    } else {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
      this.passwordConfirmErrorMessage = '';
      this.captchaVerifyErrorMessage = '';
    }

    if (
      this.state.emailError ||
      this.state.passwordError ||
      this.state.passwordConfirmError ||
      this.state.serverFieldError
    ) {
      this.setState({ validForm: false });
    } else {
      this.setState({ validForm: true });
    }
  };

  // Submit the SignUp Form
  handleSubmit = event => {
    event.preventDefault();

    let defaults = UserPreferencesStore.getPreferences();
    let BASE_URL = defaults.Server;

    let serverUrl = this.state.serverUrl;
    if (serverUrl.slice(-1) === '/') {
      serverUrl = serverUrl.slice(0, -1);
    }
    if (serverUrl !== '') {
      BASE_URL = serverUrl;
    }
    let signupEndPoint =
      BASE_URL +
      '/aaa/signup.json?signup=' +
      this.state.email +
      '&password=' +
      encodeURIComponent(this.state.passwordValue);

    if (!this.state.isCaptchaVerified) {
      this.setState({
        captchaVerifyErrorMessage: 'Please verify that you are a human.',
      });
    }
    if (
      !this.state.emailError &&
      !this.state.passwordConfirmError &&
      !this.state.serverFieldError &&
      this.state.isCaptchaVerified
    ) {
      $.ajax({
        url: signupEndPoint,
        dataType: 'jsonp',
        crossDomain: true,
        timeout: 3000,
        async: false,
        statusCode: {
          422: function() {
            let msg = 'Email already taken. Please try with another email.';
            let state = this.state;
            state.msg = msg;
            this.setState(state);
          },
        },
        success: function(response) {
          if (response.accepted) {
            let msg = response.message;
            let state = this.state;
            state.msg = msg;
            state.success = true;
            state.msgOpen = true;
            this.setState(state);
          } else {
            let state = this.state;
            state.msg = 'Failed. Try Again';
            state.msgOpen = true;
            state.success = false;
            this.setState(state);
          }
        }.bind(this),
        error: function(jqXHR, textStatus, errorThrown) {
          let jsonValue = jqXHR.status;
          let msg;
          if (jsonValue === 404) {
            msg = 'Email already taken. Please try with another email.';
          } else {
            msg = 'Failed. Try Again';
          }
          if (status === 'timeout') {
            msg = 'Please check your internet connection';
          }

          let state = this.state;
          state.msg = msg;
          state.msgOpen = true;
          state.success = false;
          this.setState(state);
        }.bind(this),
      });
    }
  };

  // Open Forgot Password Dialog
  handleForgotPassword = () => {
    this.setState({
      openForgotPassword: true,
      open: false,
      openLogin: false,
    });
  };

  handleForgotPasswordToggle = forgotPassword => {
    if (forgotPassword) {
      this.setState({
        open: false,
        openForgotPassword: true,
        openLogin: false,
      });
    } else {
      // Go back to login dialog
      this.setState({
        open: true,
        openForgotPassword: false,
        openLogin: false,
      });
    }
  };

  // Open Login Dialog
  handleOpen = () => {
    this.setState({
      msgOpen: false,
      email: '',
      isEmail: false,
      emailError: true,
      passwordError: true,
      passwordConfirmError: true,
      passwordValue: '',
      confirmPasswordValue: '',
      msg: '',
      success: false,
      validForm: false,
      serverUrl: '',
      checked: false,
      serverFieldError: false,
    });
    this.props.onLoginSignUp();
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
    };

    const PasswordClass = [`is-strength-${this.state.passwordScore}`];

    return (
      <div className="signUpForm">
        <Paper zDepth={0} style={styles}>
          <h3>
            <Translate text="Sign Up with SUSI" />
          </h3>
          <form onSubmit={this.handleSubmit}>
            <div>
              <TextField
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                style={fieldStyle}
                inputStyle={inputStyle}
                underlineStyle={{ display: 'none' }}
                placeholder="Email"
                errorText={this.emailErrorMessage}
              />
            </div>
            <div className={PasswordClass.join(' ')}>
              <PasswordField
                name="password"
                style={fieldStyle}
                inputStyle={inputpassStyle}
                value={this.state.passwordValue}
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
              <div className="ReactPasswordStrength-strength-bar" />
              <div>
                <span>{this.state.passwordStrength}</span>
              </div>
            </div>
            <div>
              <PasswordField
                name="confirmPassword"
                style={fieldStyle}
                inputStyle={inputpassStyle}
                value={this.state.confirmPasswordValue}
                placeholder="Confirm Password"
                underlineStyle={{ display: 'none' }}
                onChange={this.handleChange}
                errorText={this.passwordConfirmErrorMessage}
                visibilityButtonStyle={{
                  marginTop: '-3px',
                }}
                visibilityIconStyle={{
                  marginTop: '-3px',
                }}
                textFieldStyle={{ padding: '0px' }}
              />
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <Recaptcha
                sitekey={CAPTCHA_KEY}
                render="explicit"
                onloadCallback={this.onCaptchaLoad}
                verifyCallback={this.verifyCaptchaCallback}
                badge="inline"
                type="audio"
                size="normal"
              />
              {!this.state.isCaptchaVerified &&
                this.state.captchaVerifyErrorMessage && (
                  <p className="error-message">
                    <Translate text={this.state.captchaVerifyErrorMessage} />
                  </p>
                )}
            </div>
            <div>
              <RaisedButton
                label={<Translate text="Sign Up" />}
                type="submit"
                disabled={!this.state.validForm}
                backgroundColor={
                  UserPreferencesStore.getTheme() === 'light'
                    ? '#4285f4'
                    : '#19314B'
                }
                labelColor="#fff"
                style={{ width: '275px', margin: '10px 0px' }}
              />
            </div>

            <span
              style={{
                display: 'inline-block',
                marginTop: '10px',
              }}
              className="login-links"
              onClick={this.handleOpen}
            >
              <Translate text="Already have an account? Login here" />
            </span>
          </form>
        </Paper>
        {this.state.msg && (
          <div>
            <Dialog
              modal={false}
              open={this.state.msgOpen}
              onRequestClose={this.handleClose}
            >
              <Translate text={this.state.msg} />
            </Dialog>
          </div>
        )}
      </div>
    );
  }
}

SignUp.propTypes = {
  history: PropTypes.object,
  onRequestClose: PropTypes.func,
  onLoginSignUp: PropTypes.func,
};
