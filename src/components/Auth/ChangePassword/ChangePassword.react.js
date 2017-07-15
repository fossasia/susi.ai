import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import './ChangePassword.css';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import zxcvbn from 'zxcvbn';
import Cookies from 'universal-cookie';

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
        };

        this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
        this.newPasswordErrorMessage = '';
        this.newPasswordConfirmErrorMessage = '';
    }

    handleClose = () => {
        let state = this.state;
        if (state.success) {
            this.props.history.push('/logout');
        }
        else {
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
    }

    handleChange = (event) => {
        let password;
        let newPassword;
        let confirmNewPassword;
        let state = this.state;

        if(event.target.name === 'password'){
            password = event.target.value;
            let validPassword = password.length >= 6;
            state.passwordValue = password;
            state.passwordError = !(password && validPassword);
        }
        else if (event.target.name === 'newPassword') {
            newPassword = event.target.value;
            let validNewPassword = newPassword.length >= 6;
            state.newPasswordValue = newPassword;
            state.newPasswordError = !(newPassword && validNewPassword);
            if(validNewPassword) {
              let result = zxcvbn(newPassword);
              state.newPasswordScore = result.score;
              let strength = [
                'Worst',
                'Bad',
                'Weak',
                'Good',
                'Strong'
              ];
              state.newPasswordStrength = strength[result.score];
            }
            else {
              state.newPasswordStrength = '';
              state.newPasswordScore = -1;
            }
        }
        else if (event.target.name === 'confirmNewPassword') {
            newPassword = this.state.newPasswordValue;
            confirmNewPassword = event.target.value;
            let validNewPassword = confirmNewPassword === newPassword;
            state.confirmNewPasswordValue = confirmNewPassword;
            state.newPasswordConfirmError = !(validNewPassword && confirmNewPassword);
        }

        if (!this.state.passwordError
            && !this.state.newPasswordError
            && !this.state.newPasswordConfirmError) {
            state.validForm = true;
        }
        else {
            state.validForm = false;
        }

        this.setState(state);

        if (this.state.passwordError) {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = 'Minimum 6 characters required';
            this.newPasswordErrorMessage = '';
            this.newPasswordConfirmErrorMessage = '';
        }
        else if (this.state.newPasswordError||
          state.newPasswordValue===state.passwordValue) {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            if(state.newPasswordValue===state.passwordValue){
              this.newPasswordErrorMessage
                  = 'Same as current password';
              state.newPasswordStrength = '';
              state.newPasswordScore = -1;
            }else{
              this.newPasswordErrorMessage
                  = 'Minimum 6 characters required';
            }
            this.newPasswordConfirmErrorMessage = '';

        }
        else if (this.state.newPasswordConfirmError) {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            this.newPasswordErrorMessage = '';
            this.newPasswordConfirmErrorMessage = 'Check your password again';
        }
        else {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            this.newPasswordErrorMessage = '';
            this.newPasswordConfirmErrorMessage = '';
        }

        if(this.state.passwordError||
        this.state.newPasswordError||
        this.state.newPasswordConfirmError||
        state.newPasswordValue===state.passwordValue){
            this.setState({validForm: false});
        }
        else{
            this.setState({validForm: true});
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let defaults = UserPreferencesStore.getPreferences();
        let defaultServerURL = defaults.StandardServer;
        let BASE_URL = '';
        if(cookies.get('serverUrl')===defaultServerURL||
            cookies.get('serverUrl')===null||
            cookies.get('serverUrl')=== undefined) {
            BASE_URL = defaultServerURL;
        }
        else{
            BASE_URL= cookies.get('serverUrl');
        }

        let email = '';
 		    if(cookies.get('email')) {
 			      email = cookies.get('email');
            console.log(email);
 		    }

        let changePasswordEndPoint =
            BASE_URL+'/aaa/changepassword.json?'+
            'changepassword=' + email +
            '&password=' + this.state.passwordValue +
            '&newpassword=' + this.state.newPasswordValue +
            '&access_token='+cookies.get('loggedIn');

        if (!this.state.passwordError
            && !this.state.newPasswordConfirmError) {
            $.ajax({
                url: changePasswordEndPoint,
                dataType: 'jsonp',
                crossDomain: true,
                timeout: 3000,
                async: false,
                statusCode: {
                    422: function() {
                      let msg = 'Invalid Credentials. Please check your Email or Password.';
                      let state = this.state;
                      state.msg = msg;
                      this.setState(state);
                    }
                },
                success: function (response) {
                    let msg = response.message+'\n Please login again.';
                    let state = this.state;
                    state.msg = msg;
                    state.success = true;
                    state.msgOpen = true;
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
                }.bind(this)
            });
        }

    }

    render() {

        const styles = {
            'width': '100%',
            'textAlign': 'center',
            'padding': '10px'
        }

        const fieldStyle={
            'width':'256px'
        }

        const actions =
            <FlatButton
                label="OK"
                backgroundColor={
                    UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
                labelStyle={{ color: '#fff' }}
                onTouchTap={this.handleClose}
            />;

        const PasswordClass=[`is-strength-${this.state.newPasswordScore}`];

        return (
            <div className="changePasswordForm">
                <Paper zDepth={0} style={styles}>
                    <h1>Change Password</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <PasswordField
                                name="password"
                                style={fieldStyle}
                                value={this.state.passwordValue}
                                onChange={this.handleChange}
                                errorText={this.passwordErrorMessage}
                                floatingLabelText="Current Password" />
                        </div>
                        <div className={PasswordClass.join(' ')}>
                            <PasswordField
                                name="newPassword"
                                style={fieldStyle}
                                value={this.state.newPasswordValue}
                                onChange={this.handleChange}
                                errorText={this.newPasswordErrorMessage}
                                floatingLabelText="New Password" />
                              <div className="ReactPasswordStrength-strength-bar" />
                              <div>
                                <p>
                                  {this.state.newPasswordStrength}
                                </p>
                              </div>
                        </div>
                        <div>
                            <PasswordField
                                name="confirmNewPassword"
                                style={fieldStyle}
                                value={this.state.confirmNewPasswordValue}
                                onChange={this.handleChange}
                                errorText={this.newPasswordConfirmErrorMessage}
                                floatingLabelText="Confirm New Password" />
                        </div>
                        <div>
                            <RaisedButton
                                label="Change"
                                type="submit"
                                disabled={!this.state.validForm}
                                backgroundColor={
                                    UserPreferencesStore.getTheme()==='light'
                                    ? '#607D8B' : '#19314B'}
                                labelColor="#fff" />
                        </div>
                    </form>
                </Paper>
                {this.state.msg && (
                    <div><Dialog
                        actions={actions}
                        modal={false}
                        open={this.state.msgOpen}
                        onRequestClose={this.handleClose}
                    >
                        {this.state.msg}
                    </Dialog></div>
                )}
            </div>
        );
    };
}

ChangePassword.propTypes = {
    history: PropTypes.object
}
