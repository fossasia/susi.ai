import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import $ from 'jquery';
import zxcvbn from 'zxcvbn';
import './SignUp.css';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import { CAPTCHA_KEY } from '../../../config.js';

const styles = {
  paperStyle: {
    width: '100%',
    textAlign: 'center',
    padding: '10px',
  },
  fieldStyle: {
    height: '35px',
    borderRadius: 4,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '0px 10px',
    width: '250px',
    marginTop: '10px',
  },
  inputStyle: {
    height: '35px',
    marginBottom: '10px',
  },
  inputpassStyle: {
    height: '35px',
    marginBottom: '10px',
    marginRight: '50px',
    width: '90%',
  },
};

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: false,
      emailErrorMessage: '',
      password: '',
      passwordError: false,
      passwordErrorMessage: '',
      passwordScore: -1,
      passwordStrength: '',
      confirmPassword: '',
      passwordConfirmError: false,
      passwordConfirmErrorMessage: '',
      isCaptchaVerified: false,
      captchaVerifyErrorMessage: '',
      serverUrl: '',
      serverFieldError: false,
      customServerMessage: '',
      signupErrorMessage: '',
      success: false,
      isDialogOpen: false,
      checked: false,
    };

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

  onCaptchaSuccess = response => {
    if (response) {
      this.setState({
        isCaptchaVerified: true,
        captchaVerifyErrorMessage: '',
      });
    }
  };

  closeDialog = () => {
    const { success } = this.state;
    if (success) {
      this.setState({
        isDialogOpen: false,
      });
      this.props.onRequestClose();
    } else {
      this.setState({
        email: '',
        emailError: false,
        emailErrorMessage: '',
        password: '',
        passwordError: false,
        passwordErrorMessage: '',
        confirmPassword: '',
        passwordConfirmError: false,
        passwordConfirmErrorMessage: '',
        passwordStrength: '',
        passwordScore: -1,
        signupErrorMessage: '',
        success: false,
        serverUrl: '',
        checked: false,
        serverFieldError: false,
        isDialogOpen: false,
      });
    }
  };

  handleServeChange = event => {
    const { checked } = this.state;
    let { serverUrl } = this.state;

    switch (event.target.value) {
      case 'customServer': {
        const defaults = UserPreferencesStore.getPreferences();
        this.setState({
          checked: !checked,
          serverUrl: defaults.StandardServer,
          serverFieldError: false,
          customServerMessage: '',
        });
        break;
      }
      case 'serverUrl': {
        serverUrl = event.target.value;
        const validServerUrl = new RegExp(
          [
            '(http|ftp|https)://[w-]+',
            '(.[w-]+)+([w.,@?^=%',
            '&amp;:~+#-]*[w@?^=%&amp;~+#-])?',
          ].join(''),
          'i',
        ).test(serverUrl);
        this.setState({
          serverUrl,
          serverFieldError: !(serverUrl && validServerUrl),
          customServerMessage: !(serverUrl && validServerUrl)
            ? 'Enter a valid URL'
            : '',
        });
        break;
      }
      default:
        break;
    }
  };

  handleTextFieldChange = event => {
    switch (event.target.name) {
      case 'email': {
        const email = event.target.value.trim();
        const validEmail = new RegExp(
          ['^[A-Z0-9._%+-]+@[A-Z0-', '9.-]+.[A-Z]{2,4}$'].join(''),
          'i',
        ).test(email);
        this.setState({
          email,
          emailError: !(validEmail && email),
          emailErrorMessage: !(validEmail && email)
            ? 'Enter a valid Email Address'
            : '',
        });
        break;
      }
      case 'password': {
        const password = event.target.value.trim();
        const passwordScore = zxcvbn(password).score;
        const strength = ['Worst', 'Bad', 'Weak', 'Good', 'Strong'];
        const passwordError = !(password.length >= 6 && password);
        this.setState({
          password,
          passwordError,
          passwordErrorMessage: passwordError
            ? 'Minimum 6 characters required'
            : '',
          passwordScore: passwordError ? -1 : passwordScore,
          passwordStrength: passwordError ? '' : strength[passwordScore],
        });
        break;
      }
      case 'confirmPassword': {
        const { password } = this.state;
        const confirmPassword = event.target.value;
        const passwordConfirmError = !(
          confirmPassword === password && confirmPassword
        );
        this.setState({
          confirmPassword,
          passwordConfirmError,
          passwordConfirmErrorMessage: passwordConfirmError
            ? 'Password does not match'
            : '',
        });
        break;
      }
      default:
        break;
    }
  };

  onSignup = event => {
    event.preventDefault();

    const {
      email,
      password,
      emailError,
      passwordConfirmError,
      serverFieldError,
      isCaptchaVerified,
    } = this.state;
    let { serverUrl } = this.state;
    const defaults = UserPreferencesStore.getPreferences();
    let BASE_URL = defaults.Server;

    if (serverUrl.slice(-1) === '/') {
      serverUrl = serverUrl.slice(0, -1);
    }
    if (serverUrl !== '') {
      BASE_URL = serverUrl;
    }

    //eslint-disable-next-line
    const signupEndPoint = `${BASE_URL}/aaa/signup.json?signup=${email}&password=${encodeURIComponent(
      password,
    )}`;

    if (!isCaptchaVerified) {
      this.setState({
        captchaVerifyErrorMessage: 'Please verify that you are a human.',
      });
    }

    if (
      !emailError &&
      !passwordConfirmError &&
      !serverFieldError &&
      isCaptchaVerified
    ) {
      $.ajax({
        url: signupEndPoint,
        dataType: 'jsonp',
        crossDomain: true,
        timeout: 3000,
        async: false,
        statusCode: {
          422: () => {
            this.setState({
              signupErrorMessage:
                'Email already taken. Please try with another email.',
            });
          },
        },
        success: response => {
          if (response.accepted) {
            this.setState({
              signupErrorMessage: response.message,
              success: true,
              isDialogOpen: true,
            });
          } else {
            this.setState({
              signupErrorMessage: 'Failed. Try Again',
              isDialogOpen: true,
              success: false,
            });
          }
        },
        error: (jqXHR, textStatus, errorThrown) => {
          const jsonValue = jqXHR.status;
          let signupErrorMessage;
          if (jsonValue === 404) {
            signupErrorMessage =
              'Email already taken. Please try with another email.';
          } else {
            signupErrorMessage = 'Failed. Try Again';
          }
          if (status === 'timeout') {
            signupErrorMessage = 'Please check your internet connection';
          }
          this.setState({
            signupErrorMessage,
            isDialogOpen: true,
            success: false,
          });
        },
      });
    }
  };

  openLogin = () => {
    this.setState({
      isDialogOpen: false,
      email: '',
      isEmail: false,
      emailError: true,
      passwordError: true,
      passwordConfirmError: true,
      password: '',
      confirmPassword: '',
      signupErrorMessage: '',
      success: false,
      serverUrl: '',
      checked: false,
      serverFieldError: false,
    });
    this.props.onLoginSignUp();
  };

  render() {
    const {
      email,
      emailError,
      emailErrorMessage,
      password,
      passwordError,
      passwordErrorMessage,
      passwordScore,
      passwordStrength,
      confirmPassword,
      passwordConfirmError,
      passwordConfirmErrorMessage,
      isCaptchaVerified,
      serverFieldError,
      captchaVerifyErrorMessage,
      signupErrorMessage,
      isDialogOpen,
    } = this.state;

    const isValid =
      email &&
      !emailError &&
      password &&
      !passwordError &&
      confirmPassword &&
      !passwordConfirmError &&
      isCaptchaVerified &&
      !serverFieldError;

    const PasswordClass = [`is-strength-${passwordScore}`];

    return (
      <div className="signUpForm">
        <Paper zDepth={0} style={styles.paperStyle}>
          <h3>
            <Translate text="Sign Up with SUSI" />
          </h3>
          <form onSubmit={this.onSignup}>
            <div>
              <TextField
                name="email"
                type="email"
                value={email}
                onChange={this.handleTextFieldChange}
                style={styles.fieldStyle}
                inputStyle={styles.inputStyle}
                underlineStyle={{ display: 'none' }}
                placeholder="Email"
                errorText={emailErrorMessage}
              />
            </div>
            <div className={PasswordClass.join(' ')}>
              <PasswordField
                name="password"
                style={styles.fieldStyle}
                inputStyle={styles.inputpassStyle}
                value={password}
                placeholder="Password"
                underlineStyle={{ display: 'none' }}
                onChange={this.handleTextFieldChange}
                errorText={passwordErrorMessage}
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
                <span>{passwordStrength}</span>
              </div>
            </div>
            <div>
              <PasswordField
                name="confirmPassword"
                style={styles.fieldStyle}
                inputStyle={styles.inputpassStyle}
                value={confirmPassword}
                placeholder="Confirm Password"
                underlineStyle={{ display: 'none' }}
                onChange={this.handleTextFieldChange}
                errorText={passwordConfirmErrorMessage}
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
                verifyCallback={this.onCaptchaSuccess}
                badge="inline"
                type="audio"
                size="normal"
              />
              {!isCaptchaVerified &&
                captchaVerifyErrorMessage && (
                  <p className="error-message">
                    <Translate text={captchaVerifyErrorMessage} />
                  </p>
                )}
            </div>
            <div>
              <RaisedButton
                label={<Translate text="Sign Up" />}
                type="submit"
                disabled={!isValid}
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
              onClick={this.openLogin}
            >
              <Translate text="Already have an account? Login here" />
            </span>
          </form>
        </Paper>
        {signupErrorMessage && (
          <div>
            <Dialog
              modal={false}
              open={isDialogOpen}
              onRequestClose={this.closeDialog}
            >
              <Translate text={signupErrorMessage} />
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
