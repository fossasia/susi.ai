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

    // Close the Change Password dialog on success
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

    // Handle changes to current, new and confirm new passwords
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
                <Translate key={1} text="Too Insecure" />,
                <Translate key={2} text="Bad" />,
                <Translate key={3} text="Weak" />,
                <Translate key={4} text="Good" />,
                <Translate key={5} text="Strong" />
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

        if (this.state.passwordError && event.target.name === 'password') {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = <Translate text="Minimum 6 characters required" />;
            this.newPasswordErrorMessage = '';
            this.newPasswordConfirmErrorMessage = '';
        }
        else if (this.state.newPasswordError && event.target.name === 'newPassword') {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            this.newPasswordErrorMessage
                = <Translate text="Minimum 6 characters required" />;
            this.newPasswordConfirmErrorMessage = '';

        }
        else if (this.state.newPasswordConfirmError && event.target.name === 'confirmNewPassword') {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            this.newPasswordErrorMessage = '';
            this.newPasswordConfirmErrorMessage = <Translate text="Check your password again" />;
        }
        else {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            this.newPasswordErrorMessage = '';
            this.newPasswordConfirmErrorMessage = '';
        }

        if(this.state.passwordError||
        this.state.newPasswordError||
        this.state.newPasswordConfirmError){
            this.setState({validForm: false});
        }
        else{
            this.setState({validForm: true});
        }
    }

    // Submit the Change Password Form
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
            '/aaa/changepassword.json?'+
            'changepassword=' + email +
            '&password=' + encodeURIComponent(this.state.passwordValue) +
            '&newpassword=' + encodeURIComponent(this.state.newPasswordValue) +
            '&access_token='+cookies.get('loggedIn');
        changePasswordEndPoint = BASE_URL+ changePasswordEndPoint;
        console.log(changePasswordEndPoint);
        if (!this.state.passwordError
            && !this.state.newPasswordConfirmError) {
            $.ajax({
                url: changePasswordEndPoint,
                dataType: 'jsonp',
                crossDomain: true,
                timeout: 3000,
                async: false,
                headers: {
                    'Accept': 'application/json, application/xml, text/play, text/html',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                statusCode: {
                    422: function() {
                      let msg = 'Invalid Credentials. Please check your Email or Password.';
                      let state = this.state;
                      state.msg = msg;
                      this.setState(state);
                    }
                },
                success: function (response) {
                    let state = this.state;
                    let msg;
                    if(response.accepted){
                        msg = response.message+'\n Please login again.';
                        state.success = true;
                    }
                    else{
                      msg = response.message+ '\n Please Try Again.';
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
                }.bind(this)
            });
        }

    }

    render() {
        const themeBackgroundColor=(this.props.settings && this.props.settings.theme)==='dark'?'#19324c':'#fff';
        const themeForegroundColor=(this.props.settings && this.props.settings.theme)==='dark'?'#fff':'#272727';

        const styles = {
            'width': '100%',
            'textAlign': 'left',
            'padding': '10px',
            paddingTop:'0px',
            backgroundColor:themeBackgroundColor
        }
        const closingStyle ={
          position: 'absolute',
          zIndex: 1200,
          fill: '#444',
          width: '26px',
          height: '26px',
          right: '10px',
          top: '10px',
          cursor:'pointer'
        }
        const fieldStyle={
            'width':'256px',
            color:themeForegroundColor
        }
        const inputStyle={
            color:themeForegroundColor
        }
        const underlineFocusStyle= {
            color: '#4285f4'
        }
        const floatingLabelStyle={
            color:'#9E9E9E'
        }
        const PasswordClass=[`is-strength-${this.state.newPasswordScore}`];

        return (
            <div className="changePasswordForm">
                <Paper zDepth={0} style={styles}>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <PasswordField
                                name="password"
                                style={fieldStyle}
                                value={this.state.passwordValue}
                                onChange={this.handleChange}
                                inputStyle={inputStyle}
                                errorText={this.passwordErrorMessage}
                                underlineFocusStyle={underlineFocusStyle}
                                floatingLabelStyle={floatingLabelStyle}
                                visibilityIconStyle={{color:themeForegroundColor}}
                                floatingLabelFocusStyle={underlineFocusStyle}
                                floatingLabelText={<Translate text="Current Password" />} />
                        </div>
                        <div className={PasswordClass.join(' ')}>
                            <PasswordField
                                name="newPassword"
                                style={fieldStyle}
                                value={this.state.newPasswordValue}
                                onChange={this.handleChange}
                                inputStyle={inputStyle}
                                floatingLabelStyle={floatingLabelStyle}
                                visibilityIconStyle={{color:themeForegroundColor}}
                                errorText={this.newPasswordErrorMessage}
                                underlineFocusStyle={underlineFocusStyle}
                                floatingLabelFocusStyle={underlineFocusStyle}
                                floatingLabelText={<Translate text="New Password" />} />
                              <div className="ReactPasswordStrength-strength-bar" />
                              <div>
                                  {this.state.newPasswordStrength}
                              </div>
                        </div>
                        <div>
                            <PasswordField
                                name="confirmNewPassword"
                                style={fieldStyle}
                                value={this.state.confirmNewPasswordValue}
                                onChange={this.handleChange}
                                inputStyle={inputStyle}
                                floatingLabelStyle={floatingLabelStyle}
                                visibilityIconStyle={{color:themeForegroundColor}}
                                errorText={this.newPasswordConfirmErrorMessage}
                                underlineFocusStyle={underlineFocusStyle}
                                floatingLabelFocusStyle={underlineFocusStyle}
                                floatingLabelText={<Translate text="Confirm New Password" />} />
                        </div>
                        <div>
                            <br />
                            <RaisedButton
                                label={<Translate text="Change" />}
                                type="submit"
                                disabled={!this.state.validForm}
                                backgroundColor='#4285f4'
                                labelColor="#fff" />
                        </div>
                    </form>
                </Paper>
                {this.state.msg && (
                    <div><Dialog
                        modal={false}
                        open={this.state.msgOpen}
                        onRequestClose={this.handleClose}
                    >
                        <Translate text={this.state.msg} />
                    <Close style={closingStyle} onTouchTap={this.handleClose} />
                    </Dialog></div>
                )}
            </div>
        );
    };
}

ChangePassword.propTypes = {
    history: PropTypes.object,
    settings: PropTypes.object
}
