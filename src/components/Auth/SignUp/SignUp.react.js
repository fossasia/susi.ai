// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Components
import Recaptcha from 'react-recaptcha';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PasswordField from 'material-ui-password-field';
import CircularProgress from 'material-ui/CircularProgress';
import Close from 'material-ui/svg-icons/navigation/close';
import Dialog from 'material-ui/Dialog';
import zxcvbn from 'zxcvbn';
import './SignUp.css';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import { CAPTCHA_KEY } from '../../../config.js';
import { isEmail } from '../../../utils';
import actions from '../../../redux/actions/app';

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
  closingStyle: {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  },
};

class SignUp extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func,
    onLoginSignUp: PropTypes.func,
    actions: PropTypes.object,
    openSignUp: PropTypes.bool,
    onRequestOpenLogin: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      passwordScore: -1,
      passwordStrength: '',
      confirmPassword: '',
      passwordConfirmErrorMessage: '',
      isCaptchaVerified: false,
      captchaVerifyErrorMessage: '',
      signupErrorMessage: '',
      success: false,
      loading: false,
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
        signupErrorMessage: '',
      });
    }
  };

  handleTextFieldChange = event => {
    switch (event.target.name) {
      case 'email': {
        const email = event.target.value.trim();
        this.setState({
          email,
          emailErrorMessage: !isEmail(email)
            ? 'Enter a valid Email Address'
            : '',
          signupErrorMessage: '',
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
          passwordErrorMessage: passwordError
            ? 'Minimum 6 characters required'
            : '',
          passwordScore: passwordError ? -1 : passwordScore,
          passwordStrength: passwordError ? '' : strength[passwordScore],
          signupErrorMessage: '',
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
          passwordConfirmErrorMessage: passwordConfirmError
            ? 'Password does not match'
            : '',
          signupErrorMessage: '',
        });
        break;
      }
      default:
        break;
    }
  };

  onSignup = event => {
    event.preventDefault();
    this.setState({
      signupErrorMessage: '',
    });

    const {
      email,
      password,
      emailErrorMessage,
      passwordConfirmErrorMessage,
      isCaptchaVerified,
    } = this.state;

    const { actions } = this.props;

    if (!isCaptchaVerified) {
      this.setState({
        captchaVerifyErrorMessage: 'Please verify that you are a human.',
      });
    }

    if (
      !emailErrorMessage &&
      !passwordConfirmErrorMessage &&
      isCaptchaVerified
    ) {
      this.setState({ loading: true });
      actions
        .getSignup({
          email,
          password: encodeURIComponent(password),
        })
        .then(({ payload }) => {
          if (payload.accepted) {
            this.setState({
              signupErrorMessage: payload.message,
              success: true,
              loading: false,
            });
          } else {
            this.setState({
              signupErrorMessage: 'Failed. Try Again',
              password: '',
              success: false,
              loading: false,
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({
            signupErrorMessage: 'Signup Failed. Try Again',
            success: false,
            password: '',
            loading: false,
          });
        });
    }
  };

  render() {
    const {
      email,
      emailErrorMessage,
      password,
      passwordErrorMessage,
      passwordScore,
      passwordStrength,
      confirmPassword,
      passwordConfirmErrorMessage,
      isCaptchaVerified,
      captchaVerifyErrorMessage,
      signupErrorMessage,
      loading,
      success,
    } = this.state;
    const { openSignUp, onRequestClose, onRequestOpenLogin } = this.props;

    const isValid =
      email &&
      !emailErrorMessage &&
      password &&
      !passwordErrorMessage &&
      confirmPassword &&
      !passwordConfirmErrorMessage &&
      isCaptchaVerified;

    const PasswordClass = [`is-strength-${passwordScore}`];

    return (
      <Dialog
        className="dialogStyle"
        modal={false}
        open={openSignUp}
        autoScrollBodyContent={true}
        bodyStyle={{
          padding: 0,
          textAlign: 'center',
        }}
        contentStyle={{ width: '35%', minWidth: '300px' }}
        onRequestClose={onRequestClose}
      >
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
              {signupErrorMessage && (
                <div style={{ color: success ? '#388e3c' : '#f44336' }}>
                  {signupErrorMessage}
                </div>
              )}
              <div>
                <RaisedButton
                  label={!loading && <Translate text="Sign Up" />}
                  type="submit"
                  disabled={!isValid || loading}
                  backgroundColor={
                    UserPreferencesStore.getTheme() === 'light'
                      ? '#4285f4'
                      : '#19314B'
                  }
                  labelColor="#fff"
                  style={{ width: '275px', margin: '10px 0px' }}
                  icon={loading && <CircularProgress size={24} />}
                />
              </div>

              <span
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                }}
                className="login-links"
                onClick={onRequestOpenLogin}
              >
                <Translate text="Already have an account? Login here" />
              </span>
            </form>
          </Paper>
        </div>
        <Close style={styles.closingStyle} onTouchTap={onRequestClose} />
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(SignUp);
