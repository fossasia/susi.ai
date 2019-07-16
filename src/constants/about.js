import React from 'react';
import styled from 'styled-components';
import susiAndroid from '../images/susi-test.mp4';
import susiiOS from '../images/ios_demo.mp4';
import susiDesktop from '../images/susi.mp4';
import googlePlay from '../images/google-play.svg';
import appStore from '../images/app-store.svg';
import urls from '../utils/urls';

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

const DesktopAppIcon = styled.a`
  text-decoration: none;
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

export const DEVICES_DATA = [
  {
    heading: 'Android devices',
    description:
      'SUSI.AI is available on android devices. Download the Android App to have access to SUSI on the go.',
    iconLink: urls.ANDROID_APP_URL,
    iconLabel: 'Get It on Google Play',
    iconComponent: PlayStore,
    videoComponent: SusiDeviceVideo,
    videoSrc: susiAndroid,
  },
  {
    heading: 'iOS devices',
    description:
      'SUSI.AI is available on iOS devices. Download the iOS App to have access to SUSI on the go.',
    iconLink: urls.IOS_APP_URL,
    iconLabel: 'Download on the App Store',
    iconComponent: AppStore,
    videoComponent: SusiDeviceVideo,
    videoSrc: susiiOS,
  },
  {
    heading: 'Desktops and Laptops',
    description:
      'You can use SUSI.AI Web Chat on your desktop and laptop. Start Chatting with SUSI.AI',
    descriptionLink: (
      <DesktopAppIcon
        target="_blank"
        rel="noopener noreferrer"
        href={urls.CHAT_URL}
      >
        here.
      </DesktopAppIcon>
    ),
    iconLink: null,
    videoComponent: SusiDesktop,
    videoSrc: susiDesktop,
  },
];
