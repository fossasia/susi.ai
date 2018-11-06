import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import zxcvbn from 'zxcvbn';
import Cookies from 'universal-cookie';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import ForgotPassword from '../ForgotPassword/ForgotPassword.react';
import './ChangePassword.css';

const cookies = new Cookies();

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordErrorMessage: '',
      newPassword: '',
      newPasswordErrorMessage: '',
      newPasswordStrength: '',
      newPasswordScore: -1,
      confirmNewPassword: '',
      newPasswordConfirmErrorMessage: '',
      dialogMessage: '',
      success: false,
      showDialog: false,
      showForgotPasswordDialog: false,
    };
  }

  handleCloseResetPassword = () => {
    const { success } = this.state;
    if (success) {
      this.props.history.push('/logout');
    } else {
      this.setState({
        password: '',
        passwordErrorMessage: '',
        newPassword: '',
        newPasswordErrorMessage: '',
        newPasswordStrength: '',
        newPasswordScore: -1,
        confirmNewPassword: '',
        newPasswordConfirmErrorMessage: '',
        dialogMessage: '',
        success: false,
        showDialog: false,
        showForgotPasswordDialog: false,
      });
    }
  };

  handleCloseForgotPassword = event => {
    this.setState({
      showForgotPasswordDialog: false,
    });
  };

  onForgotPassword = event => {
    event.preventDefault();
    this.setState({
      showForgotPasswordDialog: true,
    });
  };

  // Handle changes to current, new and confirm new passwords
  handleTextFieldChange = event => {
    switch (event.target.name) {
      case 'password': {
        const password = event.target.value.trim();
        const passwordError = !(password && password.length >= 6);
        this.setState({
          password,
          passwordErrorMessage: passwordError ? (
            <Translate text="Minimum 6 characters required" />
          ) : (
            ''
          ),
        });
        break;
      }
      case 'newPassword': {
        const newPassword = event.target.value.trim();
        const newPasswordError = !(newPassword && newPassword.length >= 6);
        const newPasswordScore = !newPasswordError
          ? zxcvbn(newPassword).score
          : -1;
        const newPasswordStrength = !newPasswordError
          ? [
              <Translate key={1} text="Too Insecure" />,
              <Translate key={2} text="Bad" />,
              <Translate key={3} text="Weak" />,
              <Translate key={4} text="Good" />,
              <Translate key={5} text="Strong" />,
            ][newPasswordScore]
          : '';

        this.setState({
          newPassword,
          newPasswordErrorMessage: newPasswordError ? (
            <Translate text="Minimum 6 characters required" />
          ) : (
            ''
          ),
          newPasswordScore,
          newPasswordStrength,
        });
        break;
      }
      case 'confirmNewPassword': {
        const { newPassword } = this.state;
        const confirmNewPassword = event.target.value.trim();
        const newPasswordConfirmError = !(
          confirmNewPassword && confirmNewPassword === newPassword
        );
        this.setState({
          confirmNewPassword,
          newPasswordConfirmErrorMessage: newPasswordConfirmError ? (
            <Translate text="Password does not match" />
          ) : (
            ''
          ),
        });
        break;
      }
      default:
        break;
    }
  };

  changePassword = event => {
    event.preventDefault();

    const {
      password,
      newPassword,
      passwordErrorMessage,
      newPasswordErrorMessage,
      newPasswordConfirmErrorMessage,
    } = this.state;

    const defaults = UserPreferencesStore.getPreferences();
    const defaultServerURL = defaults.StandardServer;
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

    const email = cookies.get('emailId') ? cookies.get('emailId') : '';

    //eslint-disable-next-line
    const changePasswordEndPoint = `${BASE_URL}/aaa/changepassword.json?changepassword=${email}&password=${encodeURIComponent(
      password,
    )}&newpassword=${encodeURIComponent(
      newPassword,
    )}&access_token=${cookies.get('loggedIn')}`;

    if (
      !(
        passwordErrorMessage ||
        newPasswordErrorMessage ||
        newPasswordConfirmErrorMessage
      )
    ) {
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
          422: () => {
            const dialogMessage =
              'Invalid Credentials. Please check your Email or Password.';
            this.setState({
              dialogMessage,
            });
          },
        },
        success: response => {
          let dialogMessage;
          let success;
          if (response.accepted) {
            dialogMessage = response.message + '\n Please login again.';
            success = true;
          } else {
            dialogMessage = response.message + '\n Please Try Again.';
            success = false;
          }
          this.setState({
            dialogMessage,
            success,
            showDialog: true,
          });
        },
        error: (jqXHR, textStatus, errorThrown) => {
          let dialogMessage = 'Failed. Try Again';
          if (status === 'timeout') {
            dialogMessage = 'Please check your internet connection';
          }
          this.setState({
            dialogMessage,
            showDialog: true,
          });
        },
      });
    }
  };

  render() {
    const {
      password,
      passwordErrorMessage,
      newPassword,
      newPasswordErrorMessage,
      confirmNewPassword,
      newPasswordConfirmErrorMessage,
      newPasswordScore,
      newPasswordStrength,
      showForgotPasswordDialog,
      dialogMessage,
      showDialog,
    } = this.state;

    const isValid =
      !(
        passwordErrorMessage &&
        newPasswordErrorMessage &&
        newPasswordConfirmErrorMessage
      ) &&
      password &&
      newPassword &&
      confirmNewPassword;

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
    const PasswordClass = [`is-strength-${newPasswordScore}`];

    return (
      <div className="changePasswordForm">
        <Paper zDepth={0} style={styles}>
          <form onSubmit={this.changePassword}>
            <div style={labelStyle}>Current Password</div>
            <div>
              <PasswordField
                name="password"
                style={fieldStyle}
                value={password}
                onChange={this.handleTextFieldChange}
                inputStyle={inputStyle}
                errorText={passwordErrorMessage}
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
                value={newPassword}
                onChange={this.handleTextFieldChange}
                inputStyle={inputStyle}
                errorText={newPasswordErrorMessage}
                underlineStyle={{ display: 'none' }}
                disableButton={true}
                visibilityButtonStyle={{ display: 'none' }}
                visibilityIconStyle={{ display: 'none' }}
              />
              <div className="ReactPasswordStrength-strength-bar" />
              <div>{newPasswordStrength}</div>
            </div>
            <br />
            <div style={labelStyle}>Verify Password</div>
            <div>
              <PasswordField
                name="confirmNewPassword"
                placeholder="Must match the new password"
                style={fieldStyle}
                value={confirmNewPassword}
                onChange={this.handleTextFieldChange}
                inputStyle={inputStyle}
                errorText={newPasswordConfirmErrorMessage}
                underlineStyle={{ display: 'none' }}
                disableButton={true}
                visibilityButtonStyle={{ display: 'none' }}
                visibilityIconStyle={{ display: 'none' }}
              />
            </div>
            <div style={submitBtnStyle}>
              <div className="forgot">
                <a onClick={this.onForgotPassword}>Forgot your password?</a>
              </div>
              <div>
                <br />
                <RaisedButton
                  label={<Translate text="Save Changes" />}
                  type="submit"
                  disabled={!isValid}
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
            open={showForgotPasswordDialog}
            onRequestClose={this.handleCloseForgotPassword}
            className="ModalDiv"
          >
            <ForgotPassword closeModal={this.handleCloseForgotPassword} />
          </Dialog>
        </div>

        {dialogMessage && (
          <div>
            <Dialog
              modal={false}
              open={showDialog}
              onRequestClose={this.handleCloseResetPassword}
            >
              <Translate text={dialogMessage} />
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
