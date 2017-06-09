import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import './SignUp.css';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types'

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
            success: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.emailErrorMessage = '';
        this.passwordErrorMessage = '';
        this.passwordConfirmErrorMessage = '';
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
                success: false

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

        this.setState(state);
        if (this.state.emailError) {
            this.emailErrorMessage = 'Enter a valid Email Address';
        }
        else if (this.state.passwordError) {
            this.emailErrorMessage = '';
            this.passwordErrorMessage
                = 'Password should contains minimum 6 characters';
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
    render() {
        const styles = {
            'margin': '60px auto',
            'width': '500px',
            'padding': '20px',
            'textAlign': 'center'
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
                            <TextField
                                name="password"
                                type="password"
                                onChange={this.handleChange}
                                errorText={this.passwordErrorMessage}
                                hintText="Password" />
                        </div>
                        <div>
                            <TextField
                                name="confirmPassword"
                                type="password"
                                onChange={this.handleChange}
                                errorText={this.passwordConfirmErrorMessage}
                                hintText="Confirm Password" />
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
                            <Link to={'/login'} >
                                <RaisedButton
                                    label='Login'
                                    primary={true} />
                            </Link>
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
            </div>
        );
    };
}
SignUp.propTypes = {
    history: PropTypes.object
}
