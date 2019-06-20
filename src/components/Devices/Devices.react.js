import React from 'react';
import PropTypes from 'prop-types';
import urls from '../../utils/urls';
import { Header } from '../shared/About';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import susiAndroid from '../../images/susi-test.gif';
import susiiOSGif from '../../images/ios_demo.gif';
import susiDesktop from '../../images/susi.gif';
import googlePlay from '../../images/google-play.svg';
import appStore from '../../images/app-store.svg';
import styled from 'styled-components';

const DeviceSection = styled.div`
  margin: 0 auto;
  max-width: none;
  padding: 100px 60px;
  position: relative;
  max-width: 85%;
  width: 935px;
  text-align: center;
  box-shadow: inset 0 200px 200px -200px #fff, inset 0 -200px 200px -200px #fff;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 1px solid #dfdfdf;

  @media (min-width: 1400px) {
    max-width: 1050px;
    width: 1050px;
    margin: 0 auto;
  }

  @media (max-width: 1000px) {
    padding: 100px 40px;
  }

  @media (max-width: 769px) {
    padding: 20px 0px;
    width: 90%;
    margin: 0 auto;
  }
`;

const DeviceDescription = styled.div`
  width: 50%;
  font-size: 43px;
  font-weight: 100;
  margin: 20px 0;
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
  height: 150px;
  @media (max-width: 769px) {
    height: auto;
  }
`;

const TextDescription = styled.p`
  font-size: 18px;
  font-weight: 300;
  line-height: 40px;
  max-width: 440px;
  color: #414141;
  font-family: sans-serif;

  @media (max-width: 1000px) {
    max-width: 100%;
    line-height: 24px;
  }
`;

const StoreIcons = styled.div`
  @media (max-width: 1000px) {
    margin: 0 auto;
    width: 180px;
    padding-bottom: 20px;
  }
`;

const PlayStore = styled.a`
  overflow: hidden;
  text-indent: 100%;
  white-space: nowrap;
  background: url(${googlePlay}) center center no-repeat;
  background-size: contain;
  float: left;
  height: 45px;
  margin: 0 10px 10px 0;
  width: 152px;

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
  height: 45px;
  width: 152px;
  margin: 0 10px 10px 0;

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

const SusiDesktop = styled.img`
  text-align: left;
  width: 90%;
  margin-left: 10%;

  @media (max-width: 1000px) {
    margin: 0;
    width: 100%;
  }
`;

const SusiDeviceImg = styled.img`
  text-align: left;
  width: 60%;
  margin-left: 10%;
  max-width: 313px;

  @media (max-width: 769px) {
    margin-left: 0px;
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
          <SusiDeviceImg src={susiAndroid} alt="susi-android" />
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
          <SusiDeviceImg src={susiiOSGif} alt="susi-iOS" />
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
          <SusiDesktop src={susiDesktop} alt="susi-webchat" />
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
