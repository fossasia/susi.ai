import React from 'react';
import PropTypes from 'prop-types';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import Footer from '../Footer/Footer.react';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import './Contact.css';

const Contact = props => {
  document.title =
    'Contact Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  scrollToTopAnimation();

  document.body.style.setProperty('background-image', 'none');

  return (
    <div>
      <StaticAppBar {...props} location={props.location} />
      <div className="gray-wrapper">
        <div className="white-grey">
          <div className="conversation__description">
            <div className="support__heading">Contact Us</div>
            <p className="support__text">
              Get the help and information you need from our community and team
              through various channels.
            </p>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="contact-content">
          <h5>SUSI</h5>
          <p>
            93 Mau Than Street<br />
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
          If you know of a safety or abuse problem with any of SUSI{"'"} s
          services{','}
          we{"'"}d like to hear about it right away. Please use our contact form
          to report the issue
        </div>
      </div>
      <Footer />
    </div>
  );
};

Contact.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Contact;
