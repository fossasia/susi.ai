import React from 'react';
import PropTypes from 'prop-types';
import urls from '../../../utils/urls';
import { Header } from '../../shared/About';
import { scrollToTopAnimation } from '../../../utils/animateScroll';
import susiAndroid from '../../../images/susi-test.mp4';
import susiiOS from '../../../images/ios_demo.mp4';
import susiDesktop from '../../../images/susi.mp4';
import googlePlay from '../../../images/google-play.svg';
import appStore from '../../../images/app-store.svg';
import styled from 'styled-components';

const DeviceSection = styled.div`
  margin: 0 auto;
  max-width: none;
  padding: 6.25rem 3.75rem;
  position: relative;
  max-width: 85%;
  width: 58.438rem;
  text-align: center;
  box-shadow: inset 0 12.5rem 12.5rem -12.5rem #fff,
    inset 0 -12.5rem 12.5rem -12.5rem #fff;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 0.063rem solid #dfdfdf;

  @media (min-width: 1400px) {
    max-width: 65.625rem;
    width: 65.625rem;
    margin: 0 auto;
  }

  @media (max-width: 1000px) {
    padding: 6.25rem 2.5rem;
  }

  @media (max-width: 769px) {
    padding: 1.25rem 0rem;
    width: 90%;
    margin: 0 auto;
  }
`;

const DeviceDescription = styled.div`
  width: 50%;
  font-size: 2.688rem;
  font-weight: 100;
  margin: 1.25rem 0;
  text-align: left;
  color: #414141;
  font-family: sans-serif;

  @media (max-width: 1000px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    text-align: center;
    width: 100%;
  }
`;

const Heading = styled.div`
  height: 9.375rem;
  @media (max-width: 769px) {
    height: auto;
  }
`;

const TextDescription = styled.p`
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 2.5rem;
  max-width: 27.5rem;
  color: #414141;
  font-family: sans-serif;

  @media (max-width: 1000px) {
    max-width: 100%;
    line-height: 1.5rem;
  }
`;

const StoreIcons = styled.div`
  @media (max-width: 1000px) {
    margin: 0 auto;
    width: 11.25rem;
    padding-bottom: 1.25rem;
  }
`;

const PlayStore = styled.a`
  overflow: hidden;
  text-indent: 100%;
  white-space: nowrap;
  background: url(${googlePlay}) center center no-repeat;
  background-size: contain;
  float: left;
  height: 2.813rem;
  margin: 0 0.625rem 0.625rem 0;
  width: 9.5rem;

  @media (max-width: 769px) {
    width: 100%;
  }
`;

const AppStore = styled.a`
  overflow: hidden;
  text-indent: 100%;
  white-space: nowrap;
  background: url(${appStore}) center center no-repeat;
  background-size: cover;
  float: left;
  height: 2.813rem;
  width: 9.5rem;
  margin: 0 0.625rem 0.625rem 0;

  @media (max-width: 769px) {
    width: 100%;
  }
`;

const ImgContainer = styled.div`
  width: 50%;
  @media (max-width: 769px) {
    width: 100%;
  }
`;

const SusiDesktop = styled.video`
  text-align: left;
  width: 90%;
  margin-left: 10%;

  @media (max-width: 1000px) {
    margin: 0;
    width: 100%;
  }
`;

const SusiDeviceVideo = styled.video`
  text-align: left;
  width: 60%;
  margin-left: 10%;
  max-width: 19.563rem;

  @media (max-width: 769px) {
    margin-left: 0rem;
  }
`;

const Devices = props => {
  // Adding title tag to page
  document.title =
    'SUSI.AI - Open Source AI for Any Device, Android, iOS, Robots, Help Desks, Linux';
  //  Scrolling to top of page when component loads
  scrollToTopAnimation();
  return (
    <div>
      <Header
        title="Devices"
        subtitle="SUSI.AI is available on many platform"
      />
      <DeviceSection>
        <DeviceDescription>
          <Heading>Android devices</Heading>
          <TextDescription>
            SUSI.AI is available on android devices. Download the Android App to
            have access to SUSI on the go.
          </TextDescription>
          <StoreIcons>
            <PlayStore
              target="_blank"
              rel="noopener noreferrer"
              href="https://play.google.com/store/apps/details?id=ai.susi&hl=en"
            >
              {' '}
              Get It on Google Play
            </PlayStore>
          </StoreIcons>
        </DeviceDescription>
        <ImgContainer>
          <SusiDeviceVideo src={susiAndroid} autoPlay loop muted playsinline />
        </ImgContainer>
      </DeviceSection>

      <DeviceSection>
        <DeviceDescription>
          <Heading>iOS devices</Heading>
          <TextDescription>
            SUSI.AI is available on iOS devices. Download the iOS App to have
            access to SUSI on the go.
          </TextDescription>
          <StoreIcons>
            <AppStore
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/fossasia/susi_iOS"
            >
              {' '}
              Download on the App Store
            </AppStore>
          </StoreIcons>
        </DeviceDescription>
        <ImgContainer>
          <SusiDeviceVideo src={susiiOS} autoPlay loop muted playsinline />
        </ImgContainer>
      </DeviceSection>

      <DeviceSection>
        <DeviceDescription>
          <Heading>Desktops and Laptops</Heading>
          <TextDescription>
            You can use SUSI.AI Web Chat on your desktop and laptop. Start
            Chatting with SUSI.AI
            <a
              style={{ textDecoration: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
              href={urls.CHAT_URL}
            >
              {' '}
              here
            </a>
          </TextDescription>
        </DeviceDescription>
        <ImgContainer>
          <SusiDesktop src={susiDesktop} autoPlay loop muted playsinline />
        </ImgContainer>
      </DeviceSection>
    </div>
  );
};

Devices.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Devices;
