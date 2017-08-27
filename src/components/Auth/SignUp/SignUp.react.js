import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import './SignUp.css';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import zxcvbn from 'zxcvbn';
import CustomServer from '../../ChatApp/CustomServer.react';
import Translate from '../../Translate/Translate.react';

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            isEmail: false,
            emailError: true,
            passwordError: true,
            passwordConfirmError: true,
            passwordValue: '',
            confirmPasswordValue: '',
            msg: '',
            success: false,
            open: false,
            openLogin: false,
            openForgotPassword: false,
            validForm: false,
            serverUrl: '',
            checked:false,
            msgOpen: false,
            serverFieldError: false
        };

        this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
        this.passwordConfirmErrorMessage = '';
        this.customServerMessage = '';

        if (document.cookie.split('=')[0] === 'loggedIn') {
            window.location.reload();
        }
    }

    // Handle closing the dialog
    handleClose = () => {
        let state = this.state;
        if (state.success) {
            this.setState({
                msgOpen: false,
            });
            this.props.onRequestClose();
        }
        else {
            this.setState({
                email: '',
                isEmail: false,
                emailError: true,
                passwordError: true,
                passwordConfirmError: true,
                passwordValue: '',
                passwordStrength: '',
                passwordScore: -1,
                confirmPasswordValue: '',
                msg: '',
                success: false,
                validForm: false,
                serverUrl: '',
                checked:false,
                serverFieldError: false,
                open: false,
                msgOpen: false
            });
        }
    }

    // Handle toggle between custom server and default server
    handleServeChange=(event)=>{
        let state = this.state;
        let serverUrl
        if (event.target.value === 'customServer') {
            state.checked = !state.checked;
            let defaults = UserPreferencesStore.getPreferences();
            state.serverUrl = defaults.StandardServer;
            state.serverFieldError = false;
        }
        else if (event.target.name === 'serverUrl'){
            serverUrl = event.target.value;
            let validServerUrl =
/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:~+#-]*[\w@?^=%&amp;~+#-])?/i
            .test(serverUrl);
            state.serverUrl = serverUrl;
            state.serverFieldError = !(serverUrl && validServerUrl);
        }
        this.setState(state);

        if (this.state.serverFieldError) {
            this.customServerMessage = 'Enter a valid URL';
        }
        else{
            this.customServerMessage = '';
        }

        if(this.state.emailError||
        this.state.passwordError||
        this.state.passwordConfirmError||
        this.state.serverFieldError){
            this.setState({validForm: false});
        }
        else{
            this.setState({validForm: true});
        }
    }

    // Handle changes in email, password and confirmPassword
    handleChange = (event) => {
        let email;
        let password;
        let confirmPassword;
        // let serverUrl;
        let state = this.state
        if (event.target.name === 'email') {
            email = event.target.value.trim();
            let validEmail =
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
            state.email = email;
            state.isEmail = validEmail;
            state.emailError = !(email || validEmail)
        }
        else if (event.target.name === 'password') {
            password = event.target.value;
            let validPassword = password.length >= 6;
            state.passwordValue=password;
            state.passwordError = !(password && validPassword);
            if(validPassword) {
              let result = zxcvbn(password);
              state.passwordScore=result.score;
              let strength = [
                'Worst',
                'Bad',
                'Weak',
                'Good',
                'Strong'
              ];
              state.passwordStrength=strength[result.score];
            }
            else {
              state.passwordStrength='';
              state.passwordScore=-1;
            }
        }
        else if (event.target.name === 'confirmPassword') {
            password = this.state.passwordValue;
            confirmPassword = event.target.value;
            let validPassword = confirmPassword === password;
            state.confirmPasswordValue = confirmPassword;
            state.passwordConfirmError = !(validPassword && confirmPassword);
        }

        if (!this.state.emailError
            && !this.state.passwordError
            && !this.state.passwordConfirmError) {
            state.validForm = true;
        }
        else {
            state.validForm = false;
        }

        this.setState(state);

        if (this.state.emailError) {
            this.emailErrorMessage = 'Enter a valid Email Address';
        }
        else if (this.state.passwordError) {
            this.emailErrorMessage = '';
            this.passwordErrorMessage
                = 'Minimum 6 characters required';
            this.passwordConfirmErrorMessage = '';

        }
        else if (this.state.passwordConfirmError) {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            this.passwordConfirmErrorMessage = 'Check your password again';
        }
        else {
            this.emailErrorMessage = '';
            this.passwordErrorMessage = '';
            this.passwordConfirmErrorMessage = '';
        }

        if(this.state.emailError||
        this.state.passwordError||
        this.state.passwordConfirmError||
        this.state.serverFieldError){
            this.setState({validForm: false});
        }
        else{
            this.setState({validForm: true});
        }
    }

    // Submit the SignUp Form
    handleSubmit = (event) => {
        event.preventDefault();

        let defaults = UserPreferencesStore.getPreferences();
        let BASE_URL = defaults.Server;

        let serverUrl = this.state.serverUrl;
        if(serverUrl.slice(-1) === '/'){
            serverUrl = serverUrl.slice(0,-1);
        }
        if(serverUrl !== ''){
            BASE_URL = serverUrl;
        }
        let signupEndPoint =
            BASE_URL+'/aaa/signup.json?signup=' + this.state.email +
            '&password=' + encodeURIComponent(this.state.passwordValue);

        if (!this.state.emailError && !this.state.passwordConfirmError
            && !this.state.serverFieldError) {
            $.ajax({
                url: signupEndPoint,
                dataType: 'jsonp',
                crossDomain: true,
                timeout: 3000,
                async: false,
                statusCode: {
                    422: function() {
                      let msg = 'Email already taken. Please try with another email.';
                      let state = this.state;
                      state.msg = msg;
                      this.setState(state);
                    }
                },
                success: function (response) {
                  if(response.accepted){
                    let msg = response.message;
                    let state = this.state;
                    state.msg = msg;
                    state.success = true;
                    state.msgOpen = true;
                    this.setState(state);
                  }
                  else {
                    let state = this.state;
                    state.msg = 'Failed. Try Again';
                    state.msgOpen = true;
                    state.success = false;
                    this.setState(state);
                  }
                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown) {
                    let jsonValue =  jqXHR.status;
                    let msg
                    if (jsonValue === 404) {
                      msg = 'Email already taken. Please try with another email.';
                    }
                    else {
                    msg = 'Failed. Try Again';
                    }
                    if (status === 'timeout') {
                      msg = 'Please check your internet connection';
                    }

                    let state = this.state;
                    state.msg = msg;
                    state.msgOpen = true;
                    state.success = false;
                    this.setState(state);
                }.bind(this)
            });
        }

    }

    // Open Forgot Password Dialog
    handleForgotPassword = () => {
        this.setState({
          openForgotPassword: true,
          open: false,
          openLogin: false
        });
    }

    handleForgotPasswordToggle = (forgotPassword) => {
        if(forgotPassword){
          this.setState({
            open:false,
            openForgotPassword: true,
            openLogin: false
          });
        }
        else{
          // Go back to login dialog
          this.setState({
            open: true,
            openForgotPassword: false,
            openLogin:false
          });
        }
    }

    // Open Login Dialog
    handleOpen = () => {
        this.setState(
            {
            msgOpen: false,
            email: '',
            isEmail: false,
            emailError: true,
            passwordError: true,
            passwordConfirmError: true,
            passwordValue: '',
            confirmPasswordValue: '',
            msg: '',
            success: false,
            validForm: false,
            serverUrl: '',
            checked:false,
            serverFieldError: false
        });
        this.props.onLoginSignUp();
    };

    render() {

        const styles = {
            'width': '100%',
            'textAlign': 'center',
            'padding': '10px'
        }
        const fieldStyle={
            'width':'256px'
        }
        const underlineFocusStyle= {
            color: '#4285f4'
        }

        const PasswordClass=[`is-strength-${this.state.passwordScore}`];

        return (
            <div className="signUpForm">
                <Paper zDepth={0} style={styles}>
                    <h3><Translate text="Sign Up with SUSI"/></h3>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <TextField
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                errorText={this.emailErrorMessage}
                                underlineFocusStyle={underlineFocusStyle}
                                floatingLabelFocusStyle={underlineFocusStyle}
                                floatingLabelText={<Translate text="Email" />}/>
                        </div>
                        <div className={PasswordClass.join(' ')}>
                            <PasswordField
                                name="password"
                                style={fieldStyle}
                                value={this.state.passwordValue}
                                onChange={this.handleChange}
                                errorText={this.passwordErrorMessage}
                                underlineFocusStyle={underlineFocusStyle}
                                floatingLabelFocusStyle={underlineFocusStyle}
                                floatingLabelText={<Translate text="Password" />} />
                              <div className="ReactPasswordStrength-strength-bar" />
                              <div>
                                <p>
                                  <Translate text={this.state.passwordStrength}/>
                                </p>
                              </div>
                        </div>
                        <div>
                            <PasswordField
                                name="confirmPassword"
                                style={fieldStyle}
                                value={this.state.confirmPasswordValue}
                                onChange={this.handleChange}
                                errorText={this.passwordConfirmErrorMessage}
                                underlineFocusStyle={underlineFocusStyle}
                                floatingLabelFocusStyle={underlineFocusStyle}
                                floatingLabelText={<Translate text="Confirm Password" />}/>
                        </div>
                        <div>
                            <CustomServer
                                checked={this.state.checked}
                                serverUrl={this.state.serverUrl}
                                customServerMessage={this.customServerMessage}
                                onServerChange={this.handleServeChange}/>
                        </div>
                        <div>
                            <RaisedButton
                                label={<Translate text="Sign Up"/>}
                                type="submit"
                                disabled={!this.state.validForm}
                                backgroundColor={
                                    UserPreferencesStore.getTheme()==='light'
                                    ? '#4285f4' : '#19314B'}
                                labelColor="#fff"
                                style={{margin:'15px 0 0 0 '}} />
                        </div>
                        <h4 style={{
                            margin: '5px 0'
                        }}><Translate text="OR"/></h4>
                        <div>
                            <h4 style={{
                            margin: '5px 0'
                        }}><Translate text="If you have an Account Please Login"/></h4>
                            <RaisedButton
                                onTouchTap={this.handleOpen}
                                label={<Translate text='Login'/>}
                                backgroundColor={
                                    UserPreferencesStore.getTheme()==='light'
                                    ? '#4285f4' : '#19314B'}
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
                        <Translate text={this.state.msg}/>
                    </Dialog></div>
                )}
            </div>
        );
    };
}

SignUp.propTypes = {
    history: PropTypes.object,
    onRequestClose: PropTypes.func,
    onLoginSignUp: PropTypes.func
}
