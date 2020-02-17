import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../../shared/About';
import { scrollToTopAnimation } from '../../../utils/animateScroll';
import styled from 'styled-components';

const H1 = styled.h1`
  margin-top: 5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const HomeDiv = styled.div`
  width: 75%;
  margin: 0rem auto;
`;

const Privacy = props => {
  // Adding title tag to page
  document.title =
    'Privacy Policy - SUSI.AI, Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  //  Scrolling to top of page when component loads
  scrollToTopAnimation();
  document.body.style.setProperty('background-image', 'none');
  return (
    <div>
      <Header title="Privacy" subtitle="Privacy Policy for SUSI.AI" />
      <HomeDiv>
        <H1>
          When you use our services, you’re trusting us with your information.
          We understand this is a big responsibility and we work hard to protect
          your information and put you in control.
        </H1>
        <div>
          <div>
            This Privacy Policy is meant to help you understand what information
            we collect, why we collect it, and how you can update, manage,
            export, and delete your information. We build a range of services
            that help millions of people daily to explore and interact with the
            world in new ways. Our services include:
            <ul>
              <li>SUSI.AI Smart Speaker</li>
              <li>SUSI.AI Chat</li>
              <li>Custom Chatbots</li>
              <li>Personalised Skills</li>
            </ul>
          </div>
          <p>
            You can use our services in a variety of ways to manage your
            privacy. For example, you can sign up for a SUSI.AI Account if you
            want to create and manage content like skills or chatbots, or have
            an extraordinary experience of SUSI.AI Smart Speaker. You can also
            use many SUSI.AI services when you’re signed out or without creating
            an account at all, like chatting with SUSI.AI on web or app. And
            across our services, you can adjust your privacy settings to control
            what we collect and how your information is used.
          </p>
          <h2>
            We want you to understand the types of information we collect as you
            use our services
          </h2>
          <p>
            We collect information to provide better services to all our users —
            from figuring out basic stuff like which skils you have rated to
            more complex things like locating your SUSI.AI smart speaker. The
            information SUSI.AI collects, and how that information is used,
            depends on how you use our services and how you manage your privacy
            controls. When you’re signed in, we also collect information that we
            store with your SUSI.AI Account, which we treat as personal
            information.
          </p>
          <h2>Things you create or provide to us</h2>
          <p>
            When you create a SUSI.AI Account, you provide us with personal
            information that includes your name and a password. You can also
            choose to add a phone number, Smart Speaker information or upload
            photo to your account.
          </p>
          <p>
            We also collect the content you create, upload or receive from
            others when using our services. This includes things like skills and
            chatbots you create and feedback you receive on your skills, profile
            photo you upload, and comments and rating you make on existing
            skills.
          </p>
          <h2>Information we collect as you use our services</h2>
          <p>
            We collect information about the SUSI.AI Smart speaker devices you
            have connected. We collect information about the interaction of your
            SUSI.AI smart speaker devices with our services, including IP
            address, crash reports, system activity, and the date, time, and
            referrer URL of your request.
          </p>
          <p>
            We collect this information when a SUSI.AI service on your device
            contacts our servers — for example, when you use a skill on your
            device. If you’re using an Android device with SUSI.AI smart
            speaker, your device periodically contacts SUSI.AI servers to
            provide information about your device and connection to our
            services. This information includes things like your device name,
            crash reports, and location of your device.
          </p>
          <p>
            We use various technologies to collect and store information,
            including cookies, local storage, such as browser web storage or
            application data caches, databases, and server logs.
          </p>
          <h2>Managing, reviewing, and updating your information</h2>
          <p>
            When you’re signed in, you can always review and update information
            by visiting the services you use. For example, Dashboard and
            Settings are both designed to help you manage specific types of
            content you’ve saved with SUSI.AI.
          </p>
          <h2>Deleting your information</h2>
          <div>
            To delete your information, you can:
            <ul>
              <li>Request an admin to delete your skill</li>
              <li>Delete your chatbots</li>
              <li>Delete your entire SUSI.AI account</li>
            </ul>
          </div>
          <h2>
            We build security into our services to protect your information
          </h2>
          <p>
            SUSI.AI is built with strong security features that continuously
            protect your information. The insights we gain from maintaining our
            services help us detect and automatically block security threats
            from ever reaching you. And if we do detect something risky that we
            think you should know about, we’ll notify you and help guide you
            through steps to stay better protected.
          </p>
          <div>
            We work hard to protect you and SUSI.AI from unauthorized access,
            alteration, disclosure, or destruction of information we hold,
            including:
            <ul>
              <li>
                We use encryption to keep your data private while in transit
              </li>
              <li>
                We review our information collection, storage, and processing
                practices, including physical security measures, to prevent
                unauthorized access to our systems
              </li>
              <li>
                We restrict access to personal information to SUSI.AI
                developers. Anyone with this access is subject to strict
                contractual confidentiality obligations and may be disciplined
                or terminated if they fail to meet these obligations.
              </li>
            </ul>
          </div>
        </div>
      </HomeDiv>
    </div>
  );
};

Privacy.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Privacy;
