// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debounce } from 'lodash';
import styled, { css } from 'styled-components';

// Components
import Recaptcha from 'react-recaptcha';
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
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
} from '../AuthStyles';

const RecaptchaContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  line-height: 0.75rem;
  color: rgb(244, 67, 54);
  margin-top: 0.36rem;
`;

const PasswordStrengthBar = styled.div`
  height: 2px;
  transition: width 300ms ease-out;
  margin: 0 auto;
${props =>
  props.score === -1 &&
  css`
    display: none;
  `}
  ${props =>
    props.score === (0 || 1) &&
    css`
      background: #d1462f;
      width: 4rem;
    `}
  ${props =>
    props.score === 2 &&
    css`
      background: #57b8ff;
      width: 8rem;
    `}
  ${props =>
    props.score === 3 &&
    css`
      background: #57b8ff;
      width: 12rem;
    `}
  ${props =>
    props.score === 4 &&
    css`
      background: #2fbf71;
      width: 16rem;
    `}
}
`;

class SignUp extends Component {
  static propTypes = {
    actions: PropTypes.object,
    captchaKey: PropTypes.string,
    openSnackBar: PropTypes.func,
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
    const { actions, captchaKey } = this.props;

    const isValid =
      email &&
      !emailErrorMessage &&
      password &&
      !passwordErrorMessage &&
      confirmPassword &&
      !passwordConfirmErrorMessage &&
      (isCaptchaVerified || !captchaKey);

    return (
      <React.Fragment>
        <DialogTitle>
          <Translate text="Sign Up with SUSI" />
          <CloseButton onClick={this.handleDialogClose} />
        </DialogTitle>
        <DialogContent>
          <FormControl error={emailErrorMessage !== ''}>
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
          <FormControl error={passwordErrorMessage !== ''}>
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
          <FormControl error={passwordConfirmErrorMessage !== ''}>
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
          <RecaptchaContainer>
            {captchaKey && (
              <Recaptcha
                sitekey={captchaKey}
                render="explicit"
                onloadCallback={this.onCaptchaLoad}
                verifyCallback={this.onCaptchaSuccess}
                badge="inline"
                type="audio"
                size={window.innerWidth > 447 ? 'normal' : 'compact'}
              />
            )}
          </RecaptchaContainer>
          {!isCaptchaVerified && captchaVerifyErrorMessage && (
            <ErrorMessage>
              <Translate text={captchaVerifyErrorMessage} />
            </ErrorMessage>
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
  return {
    captchaKey,
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
