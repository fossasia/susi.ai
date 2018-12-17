// Packages
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../../redux/actions/app';

// Components
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import PasswordField from 'material-ui-password-field';
import Close from 'material-ui/svg-icons/navigation/close';
import Dialog from 'material-ui/Dialog';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import { isProduction } from '../../../utils/helperFunctions';
import { isEmail } from '../../../utils';

// Static assets
import './Login.css';

const cookieDomain = isProduction() ? '.susi.ai' : '';

const cookies = new Cookies();

const styles = {
  containerStyle: {
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

class Login extends Component {
  static propTypes = {
    handleForgotPassword: PropTypes.func,
    handleSignUp: PropTypes.func,
    actions: PropTypes.object,
    openLogin: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onRequestOpenSignUp: PropTypes.func,
    onRequestOpenForgotPassword: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      success: false,
      validForm: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      loading: false,
      message: '',
    };
  }

  handleDialogClose = () => {
    const { onRequestClose } = this.props;

    this.setState({
      email: '',
      password: '',
      success: false,
      validForm: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      loading: false,
      message: '',
    });

    onRequestClose();
  };

  // Submit the Login Form
  handleSubmit = e => {
    e.preventDefault();
    const { actions } = this.props;
    let email = this.state.email.trim();
    const password = this.state.password;

    if (!email || !password) {
      return;
    }

    if (isEmail(email)) {
      this.setState({ loading: true });
      actions
        .getLogin({ email, password: encodeURIComponent(password) })
        .then(({ payload }) => {
          if (payload.accepted) {
            this.setCookies({ ...payload, email });
            this.setState({
              success: true,
              message: payload.message,
              loading: false,
            });
            this.handleDialogClose();
          } else {
            this.setState({
              message: 'Login Failed. Try Again',
              password: '',
              loading: false,
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({
            message: 'Login Failed. Try Again',
            password: '',
            loading: false,
          });
        });
      actions
        .getAdmin()
        .then(({ payload }) => {
          let { showAdmin, accepted } = payload;
          if (accepted) {
            cookies.set('isAdmin', showAdmin, {
              path: '/',
              domain: cookieDomain,
            });
          }
          this.setState({
            isAdmin: showAdmin,
          });
        })
        .catch(error => {
          console.log('Failed to get admin');
        });
    }
  };

  // Open Forgot Password Dialog
  handleForgotPassword = () => {
    this.props.handleForgotPassword();
  };

  // Handle changes in email and password
  handleChange = event => {
    let {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      validForm,
    } = this.state;

    if (event.target.name === 'email') {
      email = event.target.value.trim();
      if (!isEmail(email)) {
        emailErrorMessage = 'Enter a valid Email Address';
      } else {
        emailErrorMessage = '';
      }
    } else if (event.target.name === 'password') {
      password = event.target.value;
      if (!password) {
        passwordErrorMessage = 'Enter a valid password';
      } else {
        passwordErrorMessage = '';
      }
    }

    if (emailErrorMessage === '' && passwordErrorMessage === '') {
      validForm = true;
    } else {
      validForm = false;
    }
    this.setState({
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      validForm,
    });
  };

  // Set Cookies on successful Login
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
    window.location.reload();
  };

  render() {
    const {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      validForm,
      loading,
      message,
    } = this.state;
    const {
      openLogin,
      onRequestOpenSignUp,
      onRequestOpenForgotPassword,
    } = this.props;
    const {
      containerStyle,
      fieldStyle,
      inputStyle,
      inputpassStyle,
      closingStyle,
    } = styles;

    return (
      <Dialog
        className="dialogStyle"
        modal={false}
        open={openLogin}
        autoScrollBodyContent={true}
        bodyStyle={{
          padding: 0,
          textAlign: 'center',
        }}
        contentStyle={{ width: '35%', minWidth: '300px' }}
        onRequestClose={this.handleDialogClose}
      >
        <div className="login-form">
          <Paper zDepth={0} style={containerStyle}>
            <div>
              <Translate text="Log into SUSI" />
            </div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <TextField
                  name="email"
                  type="email"
                  value={email}
                  onChange={this.handleChange}
                  style={fieldStyle}
                  inputStyle={inputStyle}
                  placeholder="Email"
                  underlineStyle={{ display: 'none' }}
                  errorText={emailErrorMessage}
                />
              </div>
              <div>
                <PasswordField
                  name="password"
                  style={fieldStyle}
                  inputStyle={inputpassStyle}
                  value={password}
                  placeholder="Password"
                  underlineStyle={{ display: 'none' }}
                  onChange={this.handleChange}
                  errorText={passwordErrorMessage}
                  visibilityButtonStyle={{
                    marginTop: '-3px',
                  }}
                  visibilityIconStyle={{
                    marginTop: '-3px',
                  }}
                  textFieldStyle={{ padding: '0px' }}
                />
              </div>
              {message && <div className="message">{message}</div>}
              <RaisedButton
                label={!loading && <Translate text="Log In" />}
                type="submit"
                backgroundColor={
                  UserPreferencesStore.getTheme() === 'light'
                    ? '#4285f4'
                    : '#19314B'
                }
                labelColor="#fff"
                disabled={!validForm || loading}
                style={{ width: '275px', margin: '10px 0px' }}
                icon={loading && <CircularProgress size={24} />}
              />
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
            </form>
          </Paper>
        </div>
        <Close style={closingStyle} onTouchTap={this.handleDialogClose} />
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
)(Login);
