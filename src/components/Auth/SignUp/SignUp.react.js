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
import Login from '../Login/Login.react';

export default class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            isEmail: false,
            emailError: true,
            passwordError: true,
            passwordConfirmError: true,
            passwordValue: '',
            msg: '',
            success: false,
            open: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
        this.passwordConfirmErrorMessage = '';
        if (document.cookie.split('=')[0] === 'loggedIn') {
            this.props.history.push('/');
            window.location.reload();

        }
    }

    handleClose() {
        let state = this.state;
        if (state.success) {
            this.props.history.push('/login');
        }
        else {
            this.setState({

                value: '',
                isEmail: false,
                emailError: true,
                passwordError: true,
                passwordConfirmError: true,
                passwordValue: '',
                msg: '',
                success: false,
                validForm: false

            });
        }
    };

    handleChange(event) {
        let email;
        let password;
        let confirmPassword;
        let state = this.state
        if (event.target.name === 'email') {
            email = event.target.value.trim();
            let validEmail =
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
            state.value = email;
            state.isEmail = validEmail;
            state.emailError = !(email && validEmail)
        }
        else if (event.target.name === 'password') {
            password = event.target.value;
            let validPassword = password.length >= 6;
            state.passwordValue = password;
            state.passwordError = !(password && validPassword);
        }
        else if (event.target.name === 'confirmPassword') {
            password = this.state.passwordValue;
            confirmPassword = event.target.value;
            let validPassword = confirmPassword === password;

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
    };

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.emailError && !this.state.passwordConfirmError) {
            $.ajax({
                url: 'http://api.susi.ai/aaa/signup.json?signup=' + this.state.value + '&password=' + this.state.passwordValue,
                dataType: 'jsonp',
                crossDomain: true,
                timeout: 3000,
                async: false,
                success: function (response) {
                    let msg = response.message;
                    let state = this.state;
                    state.msg = msg;
                    state.success = true;
                    this.setState(state);

                }.bind(this),
                error: function (errorThrown) {
                    let msg = 'Failed. Try Again';
                    let state = this.state;
                    state.msg = msg;
                    this.setState(state);

                }.bind(this)
            });
        }

    }
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    }
    render() {
        const styles = {
            'margin': '60px auto',
            'width': '500px',
            'padding': '20px',
            'textAlign': 'center'
        }
        const fieldStyle = {
            'width': '256px'
        }
        const actions =
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={this.handleClose}
            />;

        return (
            <div className="signUpForm">
                <Paper zDepth={1} style={styles}>
                    <h1>Sign Up with SUSI</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <TextField
                                name="email"
                                type="email"
                                onChange={this.handleChange}
                                errorText={this.emailErrorMessage}
                                hintText="Email" />
                        </div>
                        <div>
                            <PasswordField
                                name="password"
                                style={fieldStyle}
                                onChange={this.handleChange}
                                errorText={this.passwordErrorMessage}
                                floatingLabelText="Password" />
                        </div>
                        <div>
                            <PasswordField
                                name="confirmPassword"
                                style={fieldStyle}
                                onChange={this.handleChange}
                                errorText={this.passwordConfirmErrorMessage}
                                floatingLabelText="Confirm Password" />
                        </div>
                        <div>
                            <RaisedButton
                                label="Sign Up"
                                type="submit"
                                primary={true} />
                        </div>
                        <h1>OR</h1>
                        <div>
                            <h4>If you have an Account Please Login</h4>
                            <RaisedButton
                                onTouchTap={this.handleOpen}
                                label='Login'
                                primary={true} />
                        </div>
                    </form>
                </Paper>
                {this.state.msg && (
                    <div><Dialog
                        actions={actions}
                        modal={false}
                        open={true}
                        onRequestClose={this.handleClose}
                    >
                        {this.state.msg}
                    </Dialog></div>
                )
                }
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    autoScrollBodyContent={true}
                    onRequestClose={this.handleClose}>
                    <div><Login {...this.props} /></div>
                </Dialog>
            </div>
        );
    };
}
SignUp.propTypes = {
    history: PropTypes.object
}
