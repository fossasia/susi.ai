import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import './SignUp.css';
import PasswordField from 'material-ui-password-field';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Login from '../../Auth/Login/Login.react';
import zxcvbn from 'zxcvbn';
import Toggle from 'material-ui/Toggle';

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

    handleClose = () => {
        let state = this.state;
        if (state.success) {
            this.setState({
                open: false,
                showSignUp:false
            });
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
    handleServeChange=(event)=>{
        let state = this.state;
        let serverUrl
        if (event.target.value === 'customServer') {
            state.checked?state.checked=false:state.checked=true;

            if(state.checked){
                let defaults = UserPreferencesStore.getPreferences();
                state.serverUrl=defaults.Server
                state.serverFieldError = false;
            }

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

    }

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

/*         if (this.state.serverFieldError) {
            this.customServerMessage = 'Enter a valid URL';
        }
        else{
            this.customServerMessage = '';
        } */

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
            '&password=' + this.state.passwordValue;

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
                    let msg = response.message;
                    let state = this.state;
                    state.msg = msg;
                    state.success = true;
                    state.msgOpen = true;
                    this.setState(state);

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

                    this.setState(state);
                }.bind(this)
            });
        }

    }

    handleOpen = () => {
        this.setState(
            {
            open: true,
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
    };
    closealert=()=>{
        this.setState(
                {
                msgOpen: false
            });
    }
    render() {
        const customUrlStyle= {
            width:'175px',
            textAlign:'left',
            margin:'-35px 0 0px 30px',
        }
        const serverURL = <TextField
                            name="serverUrl"
                            className="serverUrl"
                            onChange={this.handleServeChange}
                            onTouchTap={this.handleServeChange}
                            value={this.state.serverUrl}
                            errorText={this.customServerMessage}
                            floatingLabelText="Custom URL"
                            style={customUrlStyle} />;

        const hidden = this.state.checked ? serverURL : '';

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
                onTouchTap={this.closealert}
            />;
        const loginActions = <RaisedButton
          label="Cancel"
          backgroundColor={
            UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
          labelColor="#fff"
          width='200px'
          keyboardFocused={true}
          onTouchTap={this.handleClose}
        />;

          const PasswordClass=[`is-strength-${this.state.passwordScore}`];

        return (
            <div className="signUpForm">
                <Paper zDepth={0} style={styles}>
                    <h1>Sign Up with SUSI</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <TextField
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                errorText={this.emailErrorMessage}
                                floatingLabelText="Email" />
                        </div>
                        <div className={PasswordClass.join(' ')}>
                            <PasswordField
                                name="password"
                                style={fieldStyle}
                                value={this.state.passwordValue}
                                onChange={this.handleChange}
                                errorText={this.passwordErrorMessage}
                                floatingLabelText="Password" />
                              <div className="ReactPasswordStrength-strength-bar" />
                              <div>
                                <p>
                                  {this.state.passwordStrength}
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
                                floatingLabelText="Confirm Password" />
                        </div>
                        <div>
                            <div>
                            <Toggle
                            labelPosition="right"
                            id={'uniqueId'}
                            labelStyle={{ zIndex: 3 }}
                            label={this.state.checked?(
                                        <label htmlFor={'uniqueId'}>
                                                <div>
                                                    {hidden}
                                                </div>
                                        </label>
                            ):'Use Custom Server'}
                            defaultToggled={false}
                            onToggle={this.handleServeChange}
                            style={{display: 'flex',
                                marginTop: '10px',
                                maxWidth:'245px',
                                flexWrap: 'wrap',
                                height:'28px',
                                margin: '30px auto 0px auto'}}
                                value="customServer"
                            />
                            </div>
                        </div>

                        <div>
                            <RaisedButton
                                label="Sign Up"
                                type="submit"
                                disabled={!this.state.validForm}
                                backgroundColor={
                                    UserPreferencesStore.getTheme()==='light'
                                    ? '#607D8B' : '#19314B'}
                                labelColor="#fff"
                                style={{margin:'25px 0 0 0 '}} />
                        </div>
                        <h1>OR</h1>
                        <div>
                            <h4>If you have an Account Please Login</h4>
                            <RaisedButton
                                onTouchTap={this.handleOpen}
                                label='Login'

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
                        onRequestClose={this.closealert}
                    >
                        {this.state.msg}
                    </Dialog></div>
                )}
                <Dialog
                  className='dialogStyle'
                  actions={loginActions}
                  modal={false}
                  open={this.state.open}
                  autoScrollBodyContent={true}
                  contentStyle={{width: '35%',minWidth: '300px'}}>
                  <Login {...this.props} />
                </Dialog>
            </div>
        );
    };
}

SignUp.propTypes = {
    history: PropTypes.object
}
