import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../shared/About';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import styled, { css } from 'styled-components';

const commonContactContent = css`
  padding: 3.125rem 0 1.563rem 0;
  max-width: 100%;
  font-family: sans-serif;
  font-weight: 300;
  text-align: left;
  width: 100%;
`;

const ContactContent = styled.div`
  ${commonContactContent};
  border-bottom: 0.063rem solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const Section = styled.div`
  max-width: 100%;
  width: 60%;
  margin: 0 auto;
  padding: 6.25rem 1.25rem 6.25rem 1.25rem;

  @media (max-width: 1000px) {
    padding: 4.375rem 1.25rem 3.125rem 1.25rem;
  }

  @media (max-width: 769px) {
    width: 80%;
  }
`;

const H5 = styled.h5`
  font-size: 1.125rem;
  font-weight: 400;
`;

const Text = styled.p`
  display: block;
  width: 85%;
  line-height: 1.375rem;
  font-weight: 500;
`;

const Contact = props => {
  document.title =
    'Contact Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  scrollToTopAnimation();
  document.body.style.setProperty('background-image', 'none');

  return (
    <div>
      <Header
        title="Contact Us"
        subtitle="Get the help and information you need from our community and team
              through various channels."
      />
      <Section>
        <ContactContent>
          <H5>SUSI</H5>
          <Text>
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
          </Text>
        </ContactContent>
        <ContactContent>
          Report a safety or abuse issue affecting our products.
          <br />
          If you know of a safety or abuse problem with any of SUSI{"'"} s
          services{','}
          we{"'"}d like to hear about it right away. Please use our contact form
          to report the issue
        </ContactContent>
      </Section>
    </div>
  );
};

Contact.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Contact;
