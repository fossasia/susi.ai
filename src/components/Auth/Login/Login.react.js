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
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseButton from '../../shared/CloseButton';
import Translate from '../../Translate/Translate.react';
import { isProduction } from '../../../utils/helperFunctions';
import { isEmail } from '../../../utils';
import { createMessagePairArray } from '../../../utils/formatMessage';
import {
  PasswordField,
  OutlinedInput,
  Button,
  StyledLink,
  LinkContainer,
} from '../AuthStyles';

const cookieDomain = isProduction() ? '.susi.ai' : '';

const cookies = new Cookies();

class Login extends Component {
  static propTypes = {
    handleSignUp: PropTypes.func,
    actions: PropTypes.object,
    openSnackBar: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
    serverUrl: PropTypes.string,
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

  render() {
    const {
      email,
      password,
      emailErrorMessage,
      passwordErrorMessage,
      loading,
    } = this.state;
    const { actions } = this.props;

    const isValid =
      email && !emailErrorMessage && password && !passwordErrorMessage;

    return (
      <React.Fragment>
        <DialogTitle>
          <Translate text="Log into SUSI" />
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
