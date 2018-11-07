import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import ChatConstants from '../../../constants/ChatConstants';
import FlatButton from 'material-ui/FlatButton';
import './ForgotPassword.css';

const styles = {
  paperStyle: {
    width: '100%',
    textAlign: 'center',
    padding: '10px',
  },
  underlineFocusStyle: {
    color: '#4285f4',
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

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: false,
      emailErrorMessage: '',
      serverUrl: '',
      serverFieldError: false,
      customServerMessage: '',
      checked: false,
      success: false,
      dialogMessage: '',
      loading: false,
    };
  }

  closeDialog = () => {
    const { success } = this.state;
    if (success) {
      this.setState({
        dialogMessage: '',
      });
    } else {
      this.setState({
        email: '',
        emailError: false,
        serverUrl: '',
        serverFieldError: false,
        customServerMessage: '',
        checked: false,
        success: false,
        dialogMessage: '',
      });
    }
  };

  handleServeChange = event => {
    let { checked, serverUrl, serverFieldError } = this.state;
    if (event.target.value === 'customServer') {
      checked = !checked;
      let defaults = UserPreferencesStore.getPreferences();
      serverUrl = defaults.StandardServer;
      serverFieldError = false;
    } else if (event.target.name === 'serverUrl') {
      serverUrl = event.target.value;
      const validServerUrl = new RegExp(
        [
          '(http|ftp|https)://[w-]+(.[w-]+)+([w.,@?^=%&amp;:~+#-]*[w@?^=%&amp;~+#-])?',
        ].join(''),
        'i',
      ).test(serverUrl);
      serverFieldError = !(serverUrl && validServerUrl);
    }
    this.setState({
      serverUrl,
      serverFieldError,
      customServerMessage: serverFieldError ? (
        <Translate text="Enter a valid URL" />
      ) : (
        ''
      ),
      checked,
    });
  };

  handleTextFieldChange = event => {
    if (event.target.name === 'email') {
      const email = event.target.value.trim();
      const validEmail = new RegExp(
        ['^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$'].join(''),
        'i',
      ).test(email);
      const emailError = !(validEmail && email);
      this.setState({
        email,
        emailError,
        emailErrorMessage: emailError ? <Translate text="Invalid Email" /> : '',
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    const { email, emailError } = this.state;
    let { serverUrl } = this.state;
    const defaults = UserPreferencesStore.getPreferences();
    let BASE_URL = defaults.Server;

    this.setState({ loading: true });

    if (serverUrl.slice(-1) === '/') {
      serverUrl = serverUrl.slice(0, -1);
    }
    if (serverUrl !== '') {
      BASE_URL = serverUrl;
    }
    if (email && !emailError) {
      $.ajax({
        url: `${BASE_URL}/aaa/recoverpassword.json?forgotemail=${email}`,
        dataType: 'jsonp',
        crossDomain: true,
        timeout: 3000,
        async: false,
        statusCode: {
          422: () => {
            this.setState({
              dialogMessage: 'Email does not exist',
              loading: false,
            });
          },
        },
        success: response => {
          let dialogMessage = response.message;
          let success;
          if (response.accepted) {
            success = true;
          } else {
            success = false;
            dialogMessage += 'Please Try Again';
          }
          this.setState({
            loading: false,
            success,
            dialogMessage,
          });
        },
        error: (jqXHR, textStatus, errorThrown) => {
          const jsonValue = jqXHR.status;
          let dialogMessage = '';
          if (jsonValue === 404) {
            dialogMessage = 'Email does not exist';
          } else {
            dialogMessage = 'Failed. Try Again';
          }
          if (status === 'timeout') {
            dialogMessage = 'Please check your internet connection';
          }
          this.setState({
            loading: false,
            dialogMessage,
          });
        },
      });
    }
  };

  render() {
    const {
      email,
      emailError,
      emailErrorMessage,
      serverFieldError,
      dialogMessage,
    } = this.state;
    const isValid = !emailError && !serverFieldError && email;

    const actions = (
      <FlatButton
        label="OK"
        backgroundColor={ChatConstants.standardBlue}
        labelStyle={{ color: '#fff' }}
        onTouchTap={this.closeDialog}
      />
    );

    return (
      <div className="forgotPwdForm">
        <Paper zDepth={0} style={styles.paperStyle}>
          <h3>
            <Translate text="Forgot Password ?" />
          </h3>
          <form onSubmit={this.handleSubmit}>
            <div>
              <TextField
                name="email"
                floatingLabelText={<Translate text="Email" />}
                errorText={emailErrorMessage}
                value={email}
                underlineFocusStyle={styles.underlineFocusStyle}
                floatingLabelFocusStyle={styles.underlineFocusStyle}
                onChange={this.handleTextFieldChange}
              />
            </div>
            <div style={{ margin: '10px 0 10px 30px' }}>
              {/* Reset Button */}
              <RaisedButton
                type="submit"
                label="Reset"
                backgroundColor={
                  UserPreferencesStore.getTheme() === 'light'
                    ? '#4285f4'
                    : '#19314B'
                }
                labelColor="#fff"
                style={{ marginRight: '15px' }}
                disabled={!isValid}
              />
              <RaisedButton
                label="Cancel"
                backgroundColor={
                  UserPreferencesStore.getTheme() === 'light'
                    ? '#4285f4'
                    : '#19314B'
                }
                labelColor="#fff"
                onTouchTap={this.props.closeModal}
              />
            </div>
          </form>
          {dialogMessage && (
            <div>
              <Dialog
                actions={actions}
                modal={false}
                open={true}
                onRequestClose={this.closeDialog}
              >
                {dialogMessage}
              </Dialog>
            </div>
          )}
        </Paper>
        {dialogMessage && (
          <div>
            <Dialog modal={false} open={true} onRequestClose={this.closeDialog}>
              <Translate text={dialogMessage} />

              <Close
                style={styles.closingStyle}
                onTouchTap={this.closeDialog}
              />
            </Dialog>
          </div>
        )}
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  onLoginSignUp: PropTypes.func,
  closeModal: PropTypes.func,
};

export default ForgotPassword;
