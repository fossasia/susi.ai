// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debounce } from 'lodash';

// Components
import Recaptcha from 'react-recaptcha';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import PasswordField from 'material-ui-password-field';
import CircularProgress from '@material-ui/core/CircularProgress';
import Close from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import zxcvbn from 'zxcvbn';
import './SignUp.css';
import Translate from '../../Translate/Translate.react';
import { isEmail } from '../../../utils';
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import { getEmailExists } from '../../../apis';

const styles = {
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
    actions: PropTypes.object,
    captchaKey: PropTypes.string,
    openSnackBar: PropTypes.func,
    modalProps: PropTypes.object,
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

    this.debouncedIsEmailAvailable = debounce(this.isEmailAvailable, 700);
  }

  handleDialogClose = () => {
    const { actions } = this.props;

    this.setState({
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
    });

    actions.closeModal();
  };

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

  isEmailAvailable = () => {
    const { email, emailErrorMessage } = this.state;
    if (!emailErrorMessage) {
      getEmailExists({
        email,
      }).then(payload => {
        const { exists } = payload;
        this.setState({
          emailErrorMessage: exists
            ? 'Email ID already taken, please use another account'
            : '',
        });
      });
    }
  };

  handleTextFieldChange = event => {
    switch (event.target.name) {
      case 'email': {
        const email = event.target.value.trim();
        this.setState(
          {
            email,
            emailErrorMessage: !isEmail(email)
              ? 'Enter a valid Email Address'
              : '',
            signupErrorMessage: '',
          },
          this.debouncedIsEmailAvailable,
        );
        break;
      }
      case 'password': {
        const { confirmPassword, passwordConfirmErrorMessage } = this.state;
        const password = event.target.value.trim();
        const passwordScore = zxcvbn(password).score;
        const strength = ['Worst', 'Bad', 'Weak', 'Good', 'Strong'];
        const passwordError = !(password.length >= 6 && password);
        const passwordConfirmError =
          (confirmPassword || passwordConfirmErrorMessage) &&
          !(confirmPassword === password);
        this.setState({
          password,
          passwordErrorMessage: passwordError
            ? 'Minimum 6 characters required'
            : '',
          passwordScore: passwordError ? -1 : passwordScore,
          passwordStrength: passwordError ? '' : strength[passwordScore],
          passwordConfirmErrorMessage: passwordConfirmError
            ? 'Password does not match'
            : '',
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

    const { getSignup, openSnackBar } = this.props.actions;

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
      getSignup({
        email,
        password: encodeURIComponent(password),
      })
        .then(({ payload }) => {
          if (payload.accepted) {
            this.setState({
              password: '',
              confirmPassword: '',
              passwordStrength: '',
              passwordScore: -1,
              signupErrorMessage: payload.message,
              success: true,
              loading: false,
            });
          } else {
            this.setState({
              password: '',
              success: false,
              loading: false,
            });
            openSnackBar({
              snackBarMessage: 'Signup Failed. Try Again',
            });
          }
        })
        .catch(error => {
          this.setState({
            success: false,
            password: '',
            loading: false,
          });
          let snackBarMessage;
          if (error.statusCode === 422) {
            snackBarMessage =
              'Already registered. Please signup with a different email account';
          } else {
            snackBarMessage = 'Signup Failed. Try Again';
          }
          openSnackBar({
            snackBarMessage,
          });
        });
    }
  };

  onEnterKey = e => {
    if (e.keyCode === 13) {
      this.onSignup();
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
    const { actions, modalProps, captchaKey } = this.props;

    const isValid =
      email &&
      !emailErrorMessage &&
      password &&
      !passwordErrorMessage &&
      confirmPassword &&
      !passwordConfirmErrorMessage &&
      (isCaptchaVerified || !captchaKey);

    const PasswordClass = [`is-strength-${passwordScore}`];

    return (
      <Dialog
        maxWidth={'sm'}
        fullWidth={true}
        open={
          modalProps &&
          modalProps.isModalOpen &&
          modalProps.modalType === 'signUp'
        }
        onClose={actions.closeModal}
        onKeyUp={this.onEnterKey}
      >
        <div className="signUpForm">
          <h3>
            <Translate text="Sign Up with SUSI" />
          </h3>
          <div>
            <FormControl error={emailErrorMessage !== ''}>
              <OutlinedInput
                labelWidth={0}
                name="email"
                value={email}
                onChange={this.handleTextFieldChange}
                aria-describedby="email-error-text"
                style={{ width: '17rem', height: '2.1rem' }}
                placeholder="Email"
                autoFocus={true}
              />
              <FormHelperText error={emailErrorMessage !== ''}>
                {emailErrorMessage}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={PasswordClass.join(' ')}>
            <FormControl error={passwordErrorMessage !== ''}>
              <PasswordField
                name="password"
                style={styles.fieldStyle}
                value={password}
                placeholder="Password"
                onChange={this.handleTextFieldChange}
              />
              <FormHelperText error={passwordErrorMessage !== ''}>
                {passwordErrorMessage}
              </FormHelperText>
            </FormControl>
            <div className="ReactPasswordStrength-strength-bar" />
            <div>
              <span>{passwordStrength}</span>
            </div>
          </div>
          <div>
            <FormControl error={passwordConfirmErrorMessage !== ''}>
              <PasswordField
                name="confirmPassword"
                style={styles.fieldStyle}
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={this.handleTextFieldChange}
              />
              <FormHelperText error={passwordConfirmErrorMessage !== ''}>
                {passwordConfirmErrorMessage}
              </FormHelperText>
            </FormControl>
          </div>
          <div
            style={{
              marginTop: '10px',
            }}
          >
            {captchaKey && (
              <Recaptcha
                sitekey={captchaKey}
                render="explicit"
                onloadCallback={this.onCaptchaLoad}
                verifyCallback={this.onCaptchaSuccess}
                badge="inline"
                type="audio"
                size="normal"
              />
            )}
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
            <Button
              onClick={this.onSignup}
              variant="contained"
              color="primary"
              disabled={!isValid || loading}
              style={{
                width: '275px',
                margin: '10px auto',
                display: 'block',
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Translate text="Sign Up" />
              )}
            </Button>
          </div>

          <span
            style={{
              display: 'inline-block',
              marginTop: '10px',
            }}
            className="login-links"
            onClick={() => actions.openModal({ modalType: 'login' })}
          >
            <Translate text="Already have an account? Login here" />
          </span>
        </div>
        <Close style={styles.closingStyle} onClick={this.handleDialogClose} />
      </Dialog>
    );
  }
}

function mapStateToProps(store) {
  const { captchaKey } = store.app.apiKeys;
  return {
    captchaKey,
    modalProps: store.ui.modalProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);
