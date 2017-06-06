import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import './SignUp.css';


export default class SignUp extends Component {

    render() {
        const styles = {
            'margin': '60px auto',
            'width': '500px',
            'padding': '20px',
            'textAlign': 'center'
        }

        return (
            <div className="signUpForm">
                <Paper zDepth={1} style={styles}>
                    <h1>Sign Up with SUSI</h1>
                    <form>
                        <div>
                            <TextField
                            name="email"
                            type="email"
                            hintText="Email" />
                        </div>
                        <div>
                            <TextField
                            name="password"
                            type="password"
                            hintText="Password" />
                        </div>
                        <div>
                            <TextField
                            name="confirm_password"
                            type="password"
                            hintText="Confirm Password" />
                        </div>
                        <div>
                            <RaisedButton label="Sign Up" primary={true} />
                        </div>
                        <h1>OR</h1>
                        <div>
                            <h4>If you have an Account Please Login</h4>
                            <RaisedButton
                                label='Login'
                                containerElement={<Link to={'/login'} />}
                                primary={true} />
                        </div>
                    </form>
                </Paper>
            </div>
        );
    };
}
