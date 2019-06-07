import React from 'react';
import PropTypes from 'prop-types';
import { HeadSection } from '../shared/About';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import './Contact.css';

const Contact = props => {
  document.title =
    'Contact Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  scrollToTopAnimation();
  document.body.style.setProperty('background-image', 'none');

  return (
    <div>
      <HeadSection>
        <div className="white-grey">
          <div className="conversation__description">
            <div className="support__heading">Contact Us</div>
            <p className="support__text">
              Get the help and information you need from our community and team
              through various channels.
            </p>
          </div>
        </div>
      </HeadSection>
      <div className="section">
        <div className="contact-content">
          <h5>SUSI</h5>
          <p>
            6 Eu Tong Sen Street
            <br />
            #5-07 The Central,
            <br />
            Singapore 059817
            <br />
            Phone +65 83435672
            <br />
            Email: support@susper.net
            <br />
            Board of Directors: Phuc Hong Dang
            <br />
          </p>
        </div>
        <div className="contact-content-last">
          Report a safety or abuse issue affecting our products.
          <br />
          If you know of a safety or abuse problem with any of SUSI{"'"} s
          services{','}
          we{"'"}d like to hear about it right away. Please use our contact form
          to report the issue
        </div>
      </div>
    </div>
  );
};

Contact.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Contact;
