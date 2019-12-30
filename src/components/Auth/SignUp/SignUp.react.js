// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debounce } from 'lodash';

// Components
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import zxcvbn from 'zxcvbn';
import CloseButton from '../../shared/CloseButton';
import Translate from '../../Translate/Translate.react';
import { isEmail } from '../../../utils';
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import { getEmailExists } from '../../../apis';
import {
  StyledLink,
  PasswordField,
  OutlinedInput,
  Button,
  LinkContainer,
  FormControl,
} from '../AuthStyles';
import PasswordStrengthBar from '../../shared/PasswordStrengthBar';
import Recaptcha from '../../shared/Recaptcha';
import isPassword from '../../../utils/isPassword';

class SignUp extends Component {
  static propTypes = {
    actions: PropTypes.object,
    captchaKey: PropTypes.string,
    openSnackBar: PropTypes.func,
    isCaptchaEnabled: PropTypes.bool,
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
      showCaptchaErrorMessage: '',
      signupErrorMessage: '',
      isCaptchaVerified: false,
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
      showCaptchaErrorMessage: false,
      signupErrorMessage: '',
      success: false,
      loading: false,
      captchaResponse: '',
    });

    actions.closeModal();
  };

  onCaptchaLoad = () => {
    this.setState({
      showCaptchaErrorMessage: true,
    });
  };

  onCaptchaSuccess = captchaResponse => {
    if (captchaResponse) {
      this.setState({
        showCaptchaErrorMessage: false,
        signupErrorMessage: '',
        captchaResponse,
        isCaptchaVerified: true,
      });
    }
  };

  isEmailAvailable = async () => {
    const { email, emailErrorMessage } = this.state;
    if (!emailErrorMessage) {
      let payload = await getEmailExists({
        email,
      });
      const { exists } = payload;
      this.setState({
        emailErrorMessage: exists
          ? 'Email ID already taken, please use another account'
          : '',
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
        const passwordError = !isPassword(password);
        const passwordConfirmError =
          (confirmPassword || passwordConfirmErrorMessage) &&
          !(confirmPassword === password);
        this.setState({
          password,
          passwordErrorMessage: passwordError
            ? 'Atleast 8 characters, 1 special character, number, 1 capital letter'
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

  onSignup = async event => {
    this.setState({
      signupErrorMessage: '',
    });

    const {
      email,
      password,
      emailErrorMessage,
      passwordConfirmErrorMessage,
      isCaptchaVerified,
      captchaResponse,
    } = this.state;

    const { getSignup, openSnackBar } = this.props.actions;

    if (
      !emailErrorMessage &&
      !passwordConfirmErrorMessage &&
      isCaptchaVerified
    ) {
      this.setState({ loading: true });
      try {
        let { payload } = await getSignup({
          email,
          password: encodeURIComponent(password),
          captchaResponse,
        });
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
          this.props.actions.openModal({
            modalType: 'login',
            message: payload.message,
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
      } catch (error) {
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
      }
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
      showCaptchaErrorMessage,
      signupErrorMessage,
      loading,
      success,
    } = this.state;
    const { actions, captchaKey, isCaptchaEnabled } = this.props;

    const isValid =
      email &&
      !emailErrorMessage &&
      password &&
      !passwordErrorMessage &&
      confirmPassword &&
      !passwordConfirmErrorMessage &&
      (isCaptchaEnabled ? isCaptchaVerified : true);
    return (
      <React.Fragment>
        <DialogTitle>
          <Translate text="Sign Up with SUSI" />
          <CloseButton onClick={this.handleDialogClose} />
        </DialogTitle>
        <DialogContent>
          <FormControl error={emailErrorMessage !== ''} disabled={loading}>
            <OutlinedInput
              labelWidth={0}
              name="email"
              value={email}
              onChange={this.handleTextFieldChange}
              aria-describedby="email-error-text"
              placeholder="Email"
              onKeyUp={this.onEnterKey}
              autoFocus={true}
            />
            <FormHelperText error={emailErrorMessage !== ''}>
              {emailErrorMessage}
            </FormHelperText>
          </FormControl>
          <FormControl error={passwordErrorMessage !== ''} disabled={loading}>
            <PasswordField
              name="password"
              value={password}
              placeholder="Password"
              onChange={this.handleTextFieldChange}
              onKeyUp={this.onEnterKey}
            />
            <FormHelperText error={passwordErrorMessage !== ''}>
              {passwordErrorMessage}
            </FormHelperText>
          </FormControl>
          <div>
            <PasswordStrengthBar score={passwordScore} />
            <span>{passwordStrength}</span>
          </div>
          <FormControl
            error={passwordConfirmErrorMessage !== ''}
            disabled={loading}
          >
            <PasswordField
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={this.handleTextFieldChange}
              onKeyUp={this.onEnterKey}
            />
            <FormHelperText error={passwordConfirmErrorMessage !== ''}>
              {passwordConfirmErrorMessage}
            </FormHelperText>
          </FormControl>
          {!!isCaptchaEnabled && captchaKey && (
            <Recaptcha
              captchaKey={captchaKey}
              onCaptchaLoad={this.onCaptchaLoad}
              onCaptchaSuccess={this.onCaptchaSuccess}
              error={showCaptchaErrorMessage}
            />
          )}
          {signupErrorMessage && (
            <div style={{ color: success ? '#388e3c' : '#f44336' }}>
              {signupErrorMessage}
            </div>
          )}
          <Button
            onClick={this.onSignup}
            variant="contained"
            color="primary"
            disabled={!isValid || loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Translate text="Sign Up" />
            )}
          </Button>
          <LinkContainer>
            <StyledLink
              onClick={() => actions.openModal({ modalType: 'login' })}
            >
              <Translate text="Already have an account? Login here" />
            </StyledLink>
          </LinkContainer>
        </DialogContent>
      </React.Fragment>
    );
  }
}

function mapStateToProps(store) {
  const { captchaKey } = store.app.apiKeys;
  const { signup: isCaptchaEnabled = true } = store.app.captchaConfig;
  return {
    captchaKey,
    isCaptchaEnabled,
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
