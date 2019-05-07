// Packages
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import appActions from '../../../redux/actions/app';
import messagesActions from '../../../redux/actions/messages';

// Components
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import PasswordField from 'material-ui-password-field';
import Close from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import { isProduction } from '../../../utils/helperFunctions';
import { isEmail } from '../../../utils';
import { createMessagePairArray } from '../../../utils/formatMessage';

// Static assets
import './Login.css';

const cookieDomain = isProduction() ? '.susi.ai' : '';

const cookies = new Cookies();

const styles = {
  containerStyle: {
    width: '100%',
    textAlign: 'center',
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

class Login extends Component {
  static propTypes = {
    handleForgotPassword: PropTypes.func,
    handleSignUp: PropTypes.func,
    onRequestClose: PropTypes.func,
    actions: PropTypes.object,
    openLogin: PropTypes.bool,
    onRequestOpenSignUp: PropTypes.func,
    onRequestOpenForgotPassword: PropTypes.func,
    openSnackBar: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
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
    };
  }

  handleDialogClose = () => {
    const { onRequestClose } = this.props;
    this.setState({
      email: '',
      password: '',
      success: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      loading: false,
    });
    onRequestClose();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { actions, openSnackBar, location, history } = this.props;
    const { password, email } = this.state;

    if (!email || !password) {
      return;
    }
    if (isEmail(email)) {
      this.setState({ loading: true });
      actions
        .getLogin({ email, password: encodeURIComponent(password) })
        .then(({ payload }) => {
          const { accessToken, time, uuid } = payload;
          let snackBarMessage;
          if (payload.accepted) {
            snackBarMessage = payload.message;
            actions
              // eslint-disable-next-line camelcase
              .getAdmin({ access_token: payload.accessToken })
              .then(({ payload }) => {
                this.setCookies({ accessToken, time, uuid, email });
                if (location.pathname !== '/') {
                  history.push('/');
                } else {
                  actions.getHistoryFromServer().then(({ payload }) => {
                    // eslint-disable-next-line
                    createMessagePairArray(payload).then(messagePairArray => {
                      actions.initializeMessageStore(messagePairArray);
                    });
                  });
                  this.setState({
                    success: true,
                    loading: false,
                  });
                }
              })
              .catch(error => {
                actions.initializeMessageStoreFailed();
                console.log(error);
              });
            this.handleDialogClose();
          } else {
            this.setState({
              password: '',
              success: false,
              loading: false,
            });
            snackBarMessage = 'Login Failed. Try Again';
          }
          openSnackBar({
            snackBarMessage,
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({
            password: '',
            success: false,
            loading: false,
          });
          openSnackBar({
            snackBarMessage: 'Login Failed. Try Again',
          });
        });
    }
  };

  handleForgotPassword = () => {
    this.props.handleForgotPassword();
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
    const defaults = UserPreferencesStore.getPreferences();
    const BASE_URL = defaults.Server;
    cookies.set('serverUrl', BASE_URL, {
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
  };

  render() {
    const {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      loading,
    } = this.state;
    const {
      openLogin,
      onRequestOpenSignUp,
      onRequestOpenForgotPassword,
    } = this.props;
    const { fieldStyle, closingStyle } = styles;

    const isValid =
      email && !emailErrorMessage && password && !passwordErrorMessage;

    return (
      <Dialog
        maxWidth={'sm'}
        fullWidth={true}
        open={openLogin}
        onClose={this.handleDialogClose}
      >
        <div className="login-form">
          <h3>
            <Translate text="Log into SUSI" />
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
              />
              <FormHelperText error={emailErrorMessage !== ''}>
                {emailErrorMessage}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl error={passwordErrorMessage !== ''}>
              <PasswordField
                name="password"
                style={fieldStyle}
                value={password}
                placeholder="Password"
                onChange={this.handleTextFieldChange}
              />
              <FormHelperText error={passwordErrorMessage !== ''}>
                {passwordErrorMessage}
              </FormHelperText>
            </FormControl>
          </div>
          <Button
            onClick={this.handleSubmit}
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
              <Translate text="Log In" />
            )}
          </Button>
          <div className="login-links-section">
            <span
              className="forgot-password"
              onClick={onRequestOpenForgotPassword}
            >
              <Translate text="Forgot Password?" />
            </span>
            <span className="sign-up" onClick={onRequestOpenSignUp}>
              <Translate text="Sign up for SUSI" />
            </span>
          </div>
        </div>
        <Close style={closingStyle} onClick={this.handleDialogClose} />
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...appActions, ...messagesActions },
      dispatch,
    ),
  };
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(Login),
);
