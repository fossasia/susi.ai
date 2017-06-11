import React,{Component} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './ForgotPassword.css';
import $ from 'jquery';
import PropTypes from 'prop-types'

class ForgotPassword extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      value: '',
	      isEmail: false,
	      msg:'',
	      success:false
	    };

	    this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.handleClose = this.handleClose.bind(this);
	}

  	handleClose(){
  		let state = this.state;
  		if(state.success){
  			this.props.history.push('/login');
  		}
  		else{
  			this.setState({
		      value: '',
		      isEmail: false,
		      msg:'',
		      success:false
		    });
  		}
  	};

	handleChange(event){
	    let email = event.target.value.trim();
	    let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
	    let state = this.state;
	    state.value = email;
	    state.isEmail = validEmail;
	    this.setState(state);
	};

	handleSubmit(event) {
	    event.preventDefault();
	    let email = this.state.value.trim();
	    let validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
	    if(email && validEmail){
	    	$.ajax({
			    url: 'http://api.susi.ai/aaa/recoverpassword.json?forgotemail='+email,
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
			'padding': '10px',
			'textAlign': 'center'
		}
		const actions =
		      <FlatButton
		        label="OK"
		        primary={true}
		        onTouchTap={this.handleClose}
		      /> ;

		let errorMsg = '';
		if(!this.state.value){
			errorMsg = 'This Field Is Required';
		}
		else if(!this.state.isEmail){
			errorMsg = 'Invalid Email';
		}
		return(
		<div className="forgotPwdForm">
			<Paper zDepth={1} style={styles}>
				<h1>Forgot Password?</h1>
				<form onSubmit={this.handleSubmit}>
					<div>
						<TextField
						name="email"
						floatingLabelText="Email"
						errorText={errorMsg}
						value={this.state.value}
          				onChange={this.handleChange}/>
          			</div>
					<div>
						<RaisedButton
						type="submit"
						label="Reset"
						primary={true}  />
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

ForgotPassword.propTypes = {
  history: PropTypes.object
};

export default ForgotPassword;
