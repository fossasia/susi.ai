import React,{Component} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router-dom';
import './Login.css';
import PasswordField from 'material-ui-password-field'

export default class Login extends Component {

	render() {
		const styles = {
			'margin': '60px auto',
			'width': '500px',
			'padding': '20px',
			'textAlign': 'center'
		}

		return(
			<div className="loginForm">
			 <Paper zDepth={1} style={styles}>
			 <h1>Login to SUSI</h1>
			<form>
	      <div>
	        <TextField
	        name="email"
	        floatingLabelText="Email"/>
	      </div>
	      <div>
	        <PasswordField
	        name='password'
	        floatingLabelText='Password'/>
	      </div>
	      <div>
	        <RaisedButton label="Login" primary={true}  />
	      </div>
	      <br/>
	      <div>
	      	<Link to='/forgotpwd'
	      	className="forgotpwdlink">
	      	<b>Forgot Password?</b>
	      	</Link>
	      </div>
	      <h1>OR</h1>
	      <div>
	        <RaisedButton
	        label='Chat Anonymously'
	        containerElement={<Link to={'/'} />}
	        primary={true} />
	      </div>
	    </form>
	    </Paper>
	    </div>
	    );
	};
}
