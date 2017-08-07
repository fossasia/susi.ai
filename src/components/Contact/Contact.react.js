import React, { Component } from 'react';
import './Contact.css';
import PropTypes  from 'prop-types';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import Footer from '../Footer/Footer.react';
import $ from 'jquery';
class Contact extends Component {

    constructor(props) {
      super(props);
      this.state = {
        showLogin: false,
        showSignUp: false,
              showForgotPassword: false,
      };
    }


    componentDidMount() {
       document.title = 'Contact Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
       $('html, body').animate({ scrollTop: 0 }, 'fast');
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
            <Footer/>
            </div>
        );
    };
}

Contact.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Contact;
