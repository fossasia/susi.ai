import React, { Component } from 'react';
import './Contact.css';
import PropTypes from 'prop-types';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import Footer from '../Footer/Footer.react';
import $ from 'jquery';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';

class Contact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showSignUp: false,
      showForgotPassword: false,
      showContact: false
    };
  }
  componentDidMount() {
    document.title = 'Contact Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  render() {
    document.body.style.setProperty('background-image', 'none');
    const bodyStyle = {
      'padding': 0,
      textAlign: 'center'
    }
    const closingStyle = {
      position: 'absolute',
      zIndex: 1200,
      fill: '#444',
      width: '26px',
      height: '26px',
      right: '10px',
      top: '10px',
      cursor: 'pointer'
    }

    return (

      <div>
        <StaticAppBar {...this.props} location={this.props.location} />
        <div className="gray-wrapper">
          <div className="white-grey">
            <div className="conversation__description">
              <div className="support__heading">Contact Us</div>
              <p className="support__text">
                Get the help and information you need from our
                    community and team through various channels.
                    </p>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="contact-content">
            <h5>SUSI</h5>
            <p>93 Mau Than Street<br />
              Can Tho<br />
              Viet Nam<br />
              Phone +84 (0) 907 65 29 27<br />
              Email: support@susper.net<br />
              Board of Directors: Phuc Hau Dang<br />
              Susper Ltd. is registered in Can Tho, Viet Nam.
              </p>
          </div>
          <div className="contact-content-last">
            Report a safety or abuse issue affecting our products.<br />
            If you know of a safety or abuse problem with any of SUSI{"'"} s services{','}
            we{"'"}d like to hear about it right away.
              Please use our contact form to report the issue
                  </div>
        </div>
        <Footer />
        <Dialog
          className='dialogStyle'
          modal={true}
          open={this.state.showContact}
          autoScrollBodyContent={true}
          bodyStyle={bodyStyle}
          contentStyle={{ width: '35%', minWidth: '300px' }}
          onRequestClose={this.handleClose}>

          <Close style={closingStyle} onTouchTap={this.handleClose} />
        </Dialog>
      </div>
    );
  };
}

Contact.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Contact;
