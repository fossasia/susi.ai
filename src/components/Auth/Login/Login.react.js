// Packages
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import appActions from '../../../redux/actions/app';
import messagesActions from '../../../redux/actions/messages';
import uiActions from '../../../redux/actions/ui';

// Components
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import PasswordField from 'material-ui-password-field';
import CloseButton from '../../shared/CloseButton';
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
};

class Login extends Component {
  static propTypes = {
    handleSignUp: PropTypes.func,
    actions: PropTypes.object,
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

  handleSubmit = e => {
    const { actions, location, history } = this.props;
    const { password, email } = this.state;

    if (!email || !password) {
      return;
    }
    if (isEmail(email)) {
      this.setState({ loading: true });
      actions
        .getLogin({ email, password: encodeURIComponent(password) })
        .then(({ payload }) => {
          let snackBarMessage;
          const { accessToken, time, uuid } = payload;
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
            snackBarMessage = 'Login Failed. Try Again';
            this.setState({
              password: '',
              success: false,
              loading: false,
            });
          }
          actions.openSnackBar({ snackBarMessage });
        })
        .catch(error => {
          console.log(error);
          this.setState({
            password: '',
            success: false,
            loading: false,
          });
          actions.openSnackBar({
            snackBarMessage: 'Login Failed. Try Again',
          });
        });
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

  onEnterKey = e => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  render() {
    const {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      loading,
    } = this.state;
    const { actions } = this.props;
    const { fieldStyle } = styles;

    const isValid =
      email && !emailErrorMessage && password && !passwordErrorMessage;

    return (
      <React.Fragment>
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
                onKeyUp={this.onEnterKey}
                autoFocus={true}
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
                onKeyUp={this.onEnterKey}
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
              onClick={() => actions.openModal({ modalType: 'forgotPassword' })}
            >
              <Translate text="Forgot Password?" />
            </span>
            <span
              className="sign-up"
              onClick={() => actions.openModal({ modalType: 'signUp' })}
            >
              <Translate text="Sign up for SUSI" />
            </span>
          </div>
        </div>
        <CloseButton onClick={this.handleDialogClose} />
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
    ...store.skills,
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Login),
);
