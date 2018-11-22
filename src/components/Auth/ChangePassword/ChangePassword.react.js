import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import './ChangePassword.css';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import zxcvbn from 'zxcvbn';
import Cookies from 'universal-cookie';
import Close from 'material-ui/svg-icons/navigation/close';
import Translate from '../../Translate/Translate.react';
import ForgotPassword from '../ForgotPassword/ForgotPassword.react';

const cookies = new Cookies();

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordError: true,
      newPasswordError: true,
      newPasswordConfirmError: true,
      newPasswordValue: '',
      passwordValue: '',
      confirmNewPasswordValue: '',
      newPasswordStrength: '',
      newPasswordScore: -1,
      msg: '',
      success: false,
      validForm: false,
      msgOpen: false,
      showForgotPwd: false,
    };

    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    this.newPasswordErrorMessage = '';
    this.newPasswordConfirmErrorMessage = '';
  }

  // Close the Change Password dialog on success
  handleCloseResetPassword = () => {
    let state = this.state;
    if (state.success) {
      this.props.history.push('/logout');
    } else {
      this.setState({
        passwordError: true,
        newPasswordError: true,
        newPasswordConfirmError: true,
        newPasswordValue: '',
        passwordValue: '',
        confirmNewPasswordValue: '',
        newPasswordStrength: '',
        newPasswordScore: -1,
        msg: '',
        success: false,
        validForm: false,
        msgOpen: false,
      });
    }
  };

  handleCloseForgotPassword = event => {
    this.setState({
      showDialog: false,
      showForgotPwd: false,
    });
  };

  handleForgotPwd = event => {
    event.preventDefault();
    this.setState({
      showForgotPwd: true,
    });
  };

  // Handle changes to current, new and confirm new passwords
  handleChange = event => {
    let password;
    let newPassword;
    let confirmNewPassword;
    let state = this.state;

    if (event.target.name === 'password') {
      password = event.target.value;
      state.passwordValue = password;
      state.passwordError = !password;
    } else if (event.target.name === 'newPassword') {
      newPassword = event.target.value;
      let validNewPassword = newPassword.length >= 6;
      state.newPasswordValue = newPassword;
      state.newPasswordError = !(newPassword && validNewPassword);
      if (validNewPassword) {
        let result = zxcvbn(newPassword);
        state.newPasswordScore = result.score;
        let strength = [
          <Translate key={1} text="Too Insecure" />,
          <Translate key={2} text="Bad" />,
          <Translate key={3} text="Weak" />,
          <Translate key={4} text="Good" />,
          <Translate key={5} text="Strong" />,
        ];
        state.newPasswordStrength = strength[result.score];
      } else {
        state.newPasswordStrength = '';
        state.newPasswordScore = -1;
      }
    } else if (event.target.name === 'confirmNewPassword') {
      newPassword = this.state.newPasswordValue;
      confirmNewPassword = event.target.value;
      let validNewPassword = confirmNewPassword === newPassword;
      state.confirmNewPasswordValue = confirmNewPassword;
      state.newPasswordConfirmError = !(validNewPassword && confirmNewPassword);
    }

    if (
      !this.state.passwordError &&
      !this.state.newPasswordError &&
      !this.state.newPasswordConfirmError
    ) {
      state.validForm = true;
    } else {
      state.validForm = false;
    }

    this.setState(state);

    if (this.state.passwordError && event.target.name === 'password') {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = (
        <Translate text="Password field cannot be blank" />
      );
      this.newPasswordErrorMessage = '';
      this.newPasswordConfirmErrorMessage = '';
    } else if (
      this.state.newPasswordError &&
      event.target.name === 'newPassword'
    ) {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
      this.newPasswordErrorMessage = (
        <Translate text="Minimum 6 characters required" />
      );
      this.newPasswordConfirmErrorMessage = '';
    } else if (
      this.state.newPasswordConfirmError &&
      event.target.name === 'confirmNewPassword'
    ) {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
      this.newPasswordErrorMessage = '';
      this.newPasswordConfirmErrorMessage = (
        <Translate text="password don't match" />
      );
    } else {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
      this.newPasswordErrorMessage = '';
      this.newPasswordConfirmErrorMessage = '';
    }

    if (
      this.state.passwordError ||
      this.state.newPasswordError ||
      this.state.newPasswordConfirmError
    ) {
      this.setState({ validForm: false });
    } else {
      this.setState({ validForm: true });
    }
  };

  // Submit the Change Password Form
  handleSubmit = event => {
    event.preventDefault();

    let defaults = UserPreferencesStore.getPreferences();
    let defaultServerURL = defaults.StandardServer;
    let BASE_URL = '';
    if (
      cookies.get('serverUrl') === defaultServerURL ||
      cookies.get('serverUrl') === null ||
      cookies.get('serverUrl') === undefined
    ) {
      BASE_URL = defaultServerURL;
    } else {
      BASE_URL = cookies.get('serverUrl');
    }

    let email = '';
    if (cookies.get('emailId')) {
      email = cookies.get('emailId');
    }
    let changePasswordEndPoint =
      '/aaa/changepassword.json?' +
      'changepassword=' +
      email +
      '&password=' +
      encodeURIComponent(this.state.passwordValue) +
      '&newpassword=' +
      encodeURIComponent(this.state.newPasswordValue) +
      '&access_token=' +
      cookies.get('loggedIn');
    changePasswordEndPoint = BASE_URL + changePasswordEndPoint;
    if (!this.state.passwordError && !this.state.newPasswordConfirmError) {
      $.ajax({
        url: changePasswordEndPoint,
        dataType: 'jsonp',
        crossDomain: true,
        timeout: 3000,
        async: false,
        headers: {
          Accept: 'application/json, application/xml, text/play, text/html',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        statusCode: {
          422: function() {
            let msg =
              'Invalid Credentials. Please check your Email or Password.';
            let state = this.state;
            state.msg = msg;
            this.setState(state);
          },
        },
        success: function(response) {
          let state = this.state;
          let msg;
          if (response.accepted) {
            msg = response.message + '\n Please login again.';
            state.success = true;
          } else {
            msg = response.message + '\n Please Try Again.';
            state.success = false;
          }
          state.msgOpen = true;
          state.msg = msg;
          this.setState(state);
        }.bind(this),
        error: function(jqXHR, textStatus, errorThrown) {
          let msg = 'Failed. Try Again';
          if (status === 'timeout') {
            msg = 'Please check your internet connection';
          }
          let state = this.state;
          state.msg = msg;
          state.msgOpen = true;
          this.setState(state);
        }.bind(this),
      });
    }
  };

  render() {
    const themeBackgroundColor =
      (this.props.settings && this.props.settings.theme) === 'dark'
        ? '#19324c'
        : '#fff';
    const themeForegroundColor =
      (this.props.settings && this.props.settings.theme) === 'dark'
        ? '#fff'
        : '#272727';

    const styles = {
      width: '100%',
      textAlign: 'left',
      padding: '10px',
      paddingTop: '0px',
      backgroundColor: themeBackgroundColor,
    };
    const closingStyle = {
      position: 'absolute',
      zIndex: 1200,
      fill: '#444',
      width: '26px',
      height: '26px',
      right: '10px',
      top: '10px',
      cursor: 'pointer',
    };
    const fieldStyle = {
      height: '35px',
      borderRadius: 4,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '0px 12px',
      width: '125%',
    };
    const labelStyle = {
      width: '30%',
      minWidth: '150px',
      float: 'left',
      marginTop: '12px',
      color:
        UserPreferencesStore.getTheme() === 'light' ||
        UserPreferencesStore.getTheme() === 'custom'
          ? 'black'
          : 'white',
    };
    const submitBtnStyle = {
      float: 'left',
      width: '300px',
      margin: '0 auto',
      marginBottom: '50px',
    };
    const inputStyle = {
      color: themeForegroundColor,
      height: '35px',
      marginBottom: '10px',
    };
    const PasswordClass = [`is-strength-${this.state.newPasswordScore}`];

    return (
      <div className="changePasswordForm">
        <Paper zDepth={0} style={styles}>
          <form onSubmit={this.handleSubmit}>
            <div style={labelStyle}>Current Password</div>
            <div>
              <PasswordField
                name="password"
                style={fieldStyle}
                value={this.state.passwordValue}
                onChange={this.handleChange}
                inputStyle={inputStyle}
                errorText={this.passwordErrorMessage}
                underlineStyle={{ display: 'none' }}
                disableButton={true}
                visibilityButtonStyle={{ display: 'none' }}
                visibilityIconStyle={{ display: 'none' }}
              />
            </div>
            <br />
            <div style={labelStyle}>New Password</div>
            <div className={PasswordClass.join(' ')}>
              <PasswordField
                name="newPassword"
                placeholder="Must be at least 6 characters"
                style={fieldStyle}
                value={this.state.newPasswordValue}
                onChange={this.handleChange}
                inputStyle={inputStyle}
                errorText={this.newPasswordErrorMessage}
                underlineStyle={{ display: 'none' }}
                disableButton={true}
                visibilityButtonStyle={{ display: 'none' }}
                visibilityIconStyle={{ display: 'none' }}
              />
              <div className="ReactPasswordStrength-strength-bar" />
              <div>{this.state.newPasswordStrength}</div>
            </div>
            <br />
            <div style={labelStyle}>Verify Password</div>
            <div>
              <PasswordField
                name="confirmNewPassword"
                placeholder="Must match the new password"
                style={fieldStyle}
                value={this.state.confirmNewPasswordValue}
                onChange={this.handleChange}
                inputStyle={inputStyle}
                errorText={this.newPasswordConfirmErrorMessage}
                underlineStyle={{ display: 'none' }}
                disableButton={true}
                visibilityButtonStyle={{ display: 'none' }}
                visibilityIconStyle={{ display: 'none' }}
              />
            </div>
            <div style={submitBtnStyle}>
              <div className="forgot">
                <a onClick={this.handleForgotPwd}>Forgot your password?</a>
              </div>
              <div>
                <br />
                <RaisedButton
                  label={<Translate text="Save Changes" />}
                  type="submit"
                  disabled={!this.state.validForm}
                  backgroundColor="#4285f4"
                  labelColor="#fff"
                />
              </div>
            </div>
          </form>
        </Paper>

        {/* Forgot Password Modal */}
        <div className="ModalDiv" style={{ width: '50%' }}>
          <Dialog
            modal={false}
            open={this.state.showForgotPwd}
            onRequestClose={this.handleCloseForgotPassword}
            className="ModalDiv"
          >
            <ForgotPassword closeModal={this.handleCloseForgotPassword} />
          </Dialog>
        </div>

        {this.state.msg && (
          <div>
            <Dialog
              modal={false}
              open={this.state.msgOpen}
              onRequestClose={this.handleCloseResetPassword}
            >
              <Translate text={this.state.msg} />
              <Close
                style={closingStyle}
                onTouchTap={this.handleCloseResetPassword}
              />
            </Dialog>
          </div>
        )}
      </div>
    );
  }
}

ChangePassword.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object,
};
