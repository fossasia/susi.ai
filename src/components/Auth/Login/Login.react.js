// Packages
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import appActions from '../../../redux/actions/app';
import messagesActions from '../../../redux/actions/messages';
import uiActions from '../../../redux/actions/ui';

// Components
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseButton from '../../shared/CloseButton';
import Translate from '../../Translate/Translate.react';
import { cookieDomain } from '../../../utils/helperFunctions';
import { isEmail } from '../../../utils';
import { createMessagePairArray } from '../../../utils/formatMessage';
import Recaptcha from '../../shared/Recaptcha';
import {
  PasswordField,
  OutlinedInput,
  FormControl,
  Button,
  StyledLink,
  LinkContainer,
} from '../AuthStyles';

const cookies = new Cookies();

class Login extends Component {
  static propTypes = {
    handleSignUp: PropTypes.func,
    actions: PropTypes.object,
    openSnackBar: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
    serverUrl: PropTypes.string,
    captchaKey: PropTypes.string,
    isCaptchaEnabled: PropTypes.bool,
    message: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      success: false,
      loading: false,
      showCaptchaErrorMessage: false,
      attempts: sessionStorage.getItem('loginAttempts') || 0,
      captchaResponse: '',
    };
  }

  componentWillUnmount() {
    sessionStorage.setItem('loginAttempts', this.state.attempts);
  }

  handleDialogClose = () => {
    const { actions } = this.props;
    this.setState({
      email: '',
      password: '',
      success: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      loading: false,
    });
    actions.closeModal();
  };

  handleSubmit = async e => {
    const { actions, location, history } = this.props;
    const { password, email, captchaResponse } = this.state;
    if (!email || !password) {
      return;
    }
    if (isEmail(email)) {
      this.setState({ loading: true });
      try {
        let { payload } = await actions.getLogin({
          email,
          password: encodeURIComponent(password),
          captchaResponse,
        });

        let snackBarMessage;
        const { accessToken, time, uuid } = payload;
        if (payload.accepted) {
          snackBarMessage = payload.message;
          try {
            /*eslint-disable */
            await actions.getAdmin({
              access_token: accessToken,
            });
            /* eslint-enable */
            this.setCookies({ accessToken, time, uuid, email });
            if (location.pathname !== '/chat') {
              history.push('/');
            } else {
              let { payload } = await actions.getHistoryFromServer();
              // eslint-disable-next-line
              let messagePairArray = await createMessagePairArray(payload);
              actions.initializeMessageStore(messagePairArray);
              this.setState({
                success: true,
                loading: false,
              });
            }
          } catch (error) {
            actions.initializeMessageStoreFailed();
            console.log(error);
          }
          this.handleDialogClose();
        } else {
          snackBarMessage = 'Login Failed. Try Again';
          this.setState(prevState => ({
            password: '',
            success: false,
            loading: false,
            attempts: prevState.attempts + 1,
          }));
        }
        actions.openSnackBar({ snackBarMessage });
      } catch (error) {
        console.log(error);
        this.setState(prevState => ({
          password: '',
          success: false,
          loading: false,
          attempts: prevState.attempts + 1,
        }));
        actions.openSnackBar({
          snackBarMessage: 'Login Failed. Try Again',
        });
      }
    }
  };

  // Handle changes in email and password
  handleTextFieldChange = event => {
    switch (event.target.name) {
      case 'email': {
        const email = event.target.value.trim();
        this.setState({
          email,
          emailErrorMessage: !isEmail(email)
            ? 'Enter a valid Email Address'
            : '',
        });
        break;
      }
      case 'password': {
        const password = event.target.value.trim();
        let passwordErrorMessage = '';
        if (!password || password.length < 6) {
          passwordErrorMessage = 'Password should be atleast 6 characters';
        }
        this.setState({
          password,
          passwordErrorMessage,
        });
        break;
      }
      default:
        break;
    }
  };

  setCookies = payload => {
    const { accessToken, time, email, uuid } = payload;
    const { serverUrl } = this.props;
    cookies.set('serverUrl', serverUrl, {
      path: '/',
      domain: cookieDomain,
    });
    cookies.set('loggedIn', accessToken, {
      path: '/',
      maxAge: time,
      domain: cookieDomain,
    });
    cookies.set('emailId', email, {
      path: '/',
      maxAge: time,
      domain: cookieDomain,
    });
    cookies.set('uuid', uuid, {
      path: '/',
      maxAge: time,
      domain: cookieDomain,
    });
  };

  onEnterKey = e => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
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
        captchaResponse,
      });
    }
  };

  render() {
    const {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      loading,
      showCaptchaErrorMessage,
      attempts,
      isCaptchaEnabled,
    } = this.state;
    const { actions, captchaKey, message } = this.props;
    const isValid =
      email &&
      !emailErrorMessage &&
      password &&
      !passwordErrorMessage &&
      // eslint-disable-next-line no-nested-ternary
      (isCaptchaEnabled
        ? attempts > 0
          ? !showCaptchaErrorMessage
          : true
        : true);
    return (
      <React.Fragment>
        <DialogTitle>
          <Translate text="Log into SUSI" />
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
          {captchaKey && isCaptchaEnabled && attempts > 0 && (
            <Recaptcha
              captchaKey={captchaKey}
              onCaptchaLoad={this.onCaptchaLoad}
              onCaptchaSuccess={this.onCaptchaSuccess}
              error={showCaptchaErrorMessage}
            />
          )}
          {message && <div style={{ color: '#388e3c' }}>{message}</div>}
          <Button
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isValid || loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Translate text="Log In" />
            )}
          </Button>
          <LinkContainer>
            <StyledLink
              onClick={() => actions.openModal({ modalType: 'forgotPassword' })}
            >
              <Translate text="Forgot Password?" />
            </StyledLink>
            <StyledLink
              onClick={() => actions.openModal({ modalType: 'signUp' })}
            >
              <Translate text="Sign up for SUSI" />
            </StyledLink>
          </LinkContainer>
        </DialogContent>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...appActions, ...messagesActions, ...uiActions },
      dispatch,
    ),
  };
}

function mapStateToProps(store) {
  return {
    ...store.router,
    serverUrl: store.settings.serverUrl,
    captchaKey: store.app.apiKeys.captchaKey,
    isCaptchaEnabled: store.app.captchaConfig
      ? store.app.captchaConfig.login
      : true,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
