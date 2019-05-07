import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ForgotPassword from '../Auth/ForgotPassword/ForgotPassword.react';
import Close from '@material-ui/icons/Close';
import Login from '../Auth/Login/Login.react';
import SignUp from '../Auth/SignUp/SignUp.react';
import './NotFound.css';
import LogoImg from '../../images/susi-logo.svg';

const style = {
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

class NotFound extends Component {
  static propTypes = {
    accessToken: PropTypes.string,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loginOpen: false,
      openForgotPassword: false,
    };
  }
  // Open Sign Up Dialog
  handleOpen = () => {
    this.setState({ open: true });
  };
  // Close all dialog boxes
  handleClose = () => {
    this.setState({
      open: false,
      loginOpen: false,
      openForgotPassword: false,
    });
  };
  // Open Login Dialog
  handleLoginOpen = () => {
    const { accessToken, history } = this.props;
    if (accessToken) {
      history.replace('');
    } else {
      this.setState({
        loginOpen: true,
        open: false,
        openForgotPassword: false,
      });
    }
  };
  // Close Login Dialog
  handleLoginClose = () => {
    this.setState({
      loginOpen: false,
    });
  };
  // Close Login Dialog and open Forgot Password dialog
  handleForgotPassword = () => {
    this.setState({
      openForgotPassword: true,
      loginOpen: false,
    });
  };
  render() {
    const { closingStyle } = style;
    const { accessToken } = this.props;
    document.body.style.setProperty('background-image', 'none');
    return (
      <div>
        <div className="container-fluid not-found-banner">
          <h2>
            <a className="susilogo">
              <img src={LogoImg} to={'/'} alt="Page Not Found" />
            </a>
          </h2>
          <h1>404</h1>
          <h2>Page not found</h2>
          <div className="button-wrapper">
            <Link
              style={{ textDecoration: 'none' }}
              to={'/'}
              className="actionButton"
            >
              <Button
                variant="contained"
                color="primary"
                className="notfound-button"
              >
                Chat With SUSI
              </Button>
            </Link>
            <br />
            {!accessToken && (
              <div>
                <Button
                  className="notfound-button"
                  onClick={this.handleOpen}
                  variant="contained"
                  color="primary"
                >
                  SignUp to SUSI
                </Button>
                <br />
                <Button
                  className="notfound-button"
                  variant="contained"
                  color="primary"
                  onClick={this.handleLoginOpen}
                >
                  Login to SUSI
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* Login */}
        <Dialog
          maxWidth={'sm'}
          fullWidth={true}
          open={this.state.loginOpen}
          onClose={this.handleClose}
        >
          <Login
            {...this.props}
            handleForgotPassword={this.handleForgotPassword}
          />
          <Close style={closingStyle} onClick={this.handleClose} />
        </Dialog>
        {/* SignUp */}
        <Dialog
          maxWidth={'sm'}
          fullWidth={true}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <SignUp
            {...this.props}
            onRequestClose={this.handleClose}
            onLoginSignUp={this.handleLoginOpen}
          />
          <Close style={closingStyle} onClick={this.handleClose} />
        </Dialog>
        <Dialog
          maxWidth={'sm'}
          fullWidth={true}
          open={this.state.openForgotPassword}
          onClose={this.handleClose}
        >
          <ForgotPassword
            {...this.props}
            showForgotPassword={this.showForgotPassword}
          />
          <Close style={closingStyle} onClick={this.handleClose} />
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { accessToken } = store.app;
  return {
    accessToken,
  };
}

export default connect(
  mapStateToProps,
  null,
)(NotFound);
