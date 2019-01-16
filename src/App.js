import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Snackbar from 'material-ui/Snackbar';
import Login from './components/Auth/Login/Login.react';
import SignUp from './components/Auth/SignUp/SignUp.react';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword.react';
import actions from './redux/actions/app';
import Layout from './Layout.react';

const muiTheme = getMuiTheme({
  toggle: {
    thumbOnColor: '#5ab1fc',
    trackOnColor: '#4285f4',
  },
});

class App extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    closeVideo: PropTypes.func,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      video: false,
      openLogin: false,
      openSignUp: false,
      openForgotPassword: false,
      snackBarOpen: false,
      snackBarMessage: '',
      snackBarDuration: 4000,
      snackBarAction: null,
      snackBarActionHandler: null,
    };
  }

  componentDidMount = () => {
    window.addEventListener('offline', this.onUserOffline);
    window.addEventListener('online', this.onUserOnline);

    this.props.actions.getApiKeys();
  };

  componentWillUnmount = () => {
    window.removeEventListener('offline', this.onUserOffline);
    window.removeEventListener('online', this.onUserOnline);
  };

  onUserOffline = () => {
    this.openSnackBar({
      snackBarMessage: 'It seems you are offline!',
    });
  };

  onUserOnline = () => {
    this.openSnackBar({
      snackBarMessage: 'Welcome back!',
    });
  };

  closeVideo = () =>
    this.setState({
      video: false,
    });

  onRequestOpenLogin = () => {
    this.setState({
      openLogin: true,
      openSignUp: false,
      openForgotPassword: false,
    });
  };

  onRequestOpenSignUp = () => {
    this.setState({
      openSignUp: true,
      openLogin: false,
      openForgotPassword: false,
    });
  };

  onRequestOpenForgotPassword = () => {
    this.setState({
      openLogin: false,
      openSignUp: false,
      openForgotPassword: true,
    });
  };

  onRequestClose = () => {
    this.setState({
      openLogin: false,
      openSignUp: false,
      openForgotPassword: false,
    });
  };

  openSnackBar = ({
    snackBarMessage,
    snackBarDuration = 4000,
    snackBarActionHandler,
    snackBarAction,
  }) => {
    this.setState({
      snackBarOpen: true,
      snackBarMessage,
      snackBarDuration,
      snackBarActionHandler,
      snackBarAction,
    });
  };

  closeSnackBar = () => {
    this.setState({
      snackBarOpen: false,
      snackBarMessage: '',
      snackBarDuration: 4000,
      snackBarAction: null,
      snackBarActionHandler: null,
    });
  };

  render() {
    const {
      openLogin,
      openSignUp,
      openForgotPassword,
      snackBarOpen,
      snackBarMessage,
      snackBarDuration,
      snackBarAction,
      snackBarActionHandler,
    } = this.state;

    if (location.pathname !== '/') {
      document.body.className = 'white-body';
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Login
            openLogin={openLogin}
            onRequestOpenForgotPassword={this.onRequestOpenForgotPassword}
            onRequestOpenSignUp={this.onRequestOpenSignUp}
            onRequestClose={this.onRequestClose}
            openSnackBar={this.openSnackBar}
          />
          <SignUp
            openSignUp={openSignUp}
            onRequestClose={this.onRequestClose}
            onRequestOpenLogin={this.onRequestOpenLogin}
            openSnackBar={this.openSnackBar}
          />
          <ForgotPassword
            openForgotPassword={openForgotPassword}
            onRequestClose={this.onRequestClose}
            openSnackBar={this.openSnackBar}
          />
          <Snackbar
            autoHideDuration={snackBarDuration}
            action={snackBarAction}
            onActionTouchTap={snackBarActionHandler}
            open={snackBarOpen}
            message={snackBarMessage}
            onRequestClose={this.closeSnackBar}
          />
          <Layout
            onRequestOpenLogin={this.onRequestOpenLogin}
            closeSnackBar={this.closeSnackBar}
            openSnackBar={this.openSnackBar}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(App),
);
