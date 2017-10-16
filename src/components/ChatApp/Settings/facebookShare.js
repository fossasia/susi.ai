import React, { Component } from 'react';
import Translate from '../../Translate/Translate.react';
import RaisedButton from 'material-ui/RaisedButton';


export default class Facebookshare extends Component{
	constructor(props){
		super(props);
		this.state={
			style:{ margin:20,},
			

		};
		this.Post=this.Post.bind(this);
		this.handleFBLogin=this.handleFBLogin.bind(this);
	
	}
	
	loadFbLoginApi() {
		
		window.fbAsyncInit = function() {
			window.FB.init({
			  appId            : '159998371255231',
			  autoLogAppEvents : true,
			  xfbml            : true,
			  version          : 'v2.10'
			});
			window.FB.AppEvents.logPageView();
		  };
		
		  (function(d, s, id){
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "//connect.facebook.net/en_US/sdk.js";
			 fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));	
		  }
		
		  componentDidMount() {
				this.loadFbLoginApi();
			}
			testAPI() {
				console.log('Welcome!  Fetching your information.... ');
				window.FB.api('/me', function(response) {
				console.log('Successful login for: ' + response.name );
				
				});
			  }
		  
			  statusChangeCallback (response) {
				console.log('statusChangeCallback');
				console.log(response);
				if (response.status === 'connected') {
				  this.testAPI();
				} else if (response.status === 'not_authorized') {
					console.log("Please log into this app.");
				} else {
					console.log("Please log into this facebook.");
				}
			  }
		  
			  checkLoginState() {
				window.FB.getLoginStatus(function(response) {
				  this.statusChangeCallback(response);
				}.bind(this));
			  }
		  
			  handleFBLogin() {
				  
				window.FB.login(this.checkLoginState);
				  }
				  Post(){
					  
					  window.FB.api('/me/feed','post',{message: "check out this App..."},function(response){
						  console.log('response.id');});
						  
					  
				  }
	
    render(){
        
        return (
            
            
					<div>
						<div>
							<div style={{
								marginTop: '10px',
								'marginBottom':'0px',
								fontSize: '15px',
								fontWeight: 'bold'}}>
								<Translate text="Post to Facebook"/>
								<br />
								<p>You need to login with facebook first.</p>
								<RaisedButton label="Login with Facebook" onClick={this.handleFBLogin} style={this.state.style} />
								<RaisedButton label="Post" onClick={this.Post} style={this.state.style} />
							</div>
							
						</div>
					</div>
				
			
            

        );
    }
}