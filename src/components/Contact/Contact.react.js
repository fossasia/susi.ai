import React, { Component } from 'react';
import './Contact.css';
import susi from '../../images/susi.svg';
import PropTypes  from 'prop-types';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
class Contact extends Component {

    constructor(props) {
      super(props);
      this.state = {
        showLogin: false,
        showSignUp: false,
              showForgotPassword: false,
      };
    }

    render() {
    return (
            <div>
            <div>
              <StaticAppBar {...this.props} location={this.props.location}/>

              <div className="section white-grey" style={{margin:'20px 0 0 0'}}>
                <div className="conversation__description">
                  <div className="support__heading">Contact Us</div>
                  <p className="support__text">
                  Get the help and information you need from our
                  community and team through various channels.
                  </p>
                </div>
              </div>
              <div className="section">
              </div>
              </div>
              <div className='footer'>
                <div className='footer-container'>
                <a href='/overview'>
                <img src={susi} alt='SUSI' className='susi-logo' />
                </a>
                <ul className='alignLeft'>
                <li><a href='/overview'>Overview</a></li>
                <li><a href='/blog'>Blog</a></li>
                <li><a href='https://github.com/fossasia?utf8=%E2%9C%93&q=susi'>Code</a></li>
                </ul>
                <ul className='alignRight'>
                <li><a href='/settings'>Settings</a></li>
                <li><a href='/terms'>Terms</a></li>
                <li><a href='/contact'>Contact</a></li>
                </ul>
            </div>
             </div>
             </div>
        );
    };
}

Contact.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Contact;
