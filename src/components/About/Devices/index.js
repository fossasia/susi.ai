import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../../shared/About';
import { scrollToTopAnimation } from '../../../utils/animateScroll';
import { DEVICES_DATA } from '../../../constants/about';
import styled from 'styled-components';

const DeviceSection = styled.div`
  margin: 0 auto;
  padding: 6.25rem 3.75rem;
  max-width: 85%;
  width: 58.438rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 0.063rem solid #dfdfdf;

  @media (min-width: 1400px) {
    max-width: 65.625rem;
    width: 65.625rem;
  }

  @media (max-width: 1000px) {
    padding: 6.25rem 2.5rem;
  }

  @media (max-width: 769px) {
    padding: 1.25rem 0rem;
    width: 90%;
  }
`;

const DeviceDescription = styled.div`
  width: 50%;
  font-size: 2.688rem;
  font-weight: 100;
  margin: 1.25rem 0;
  text-align: left;
  color: #414141;

  @media (max-width: 1000px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    text-align: center;
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

const ImgContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  @media (max-width: 769px) {
    width: 100%;
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
      {DEVICES_DATA &&
        Array.isArray(DEVICES_DATA) &&
        DEVICES_DATA.length > 0 &&
        DEVICES_DATA.map(deviceSection => {
          const {
            heading,
            description,
            descriptionLink,
            iconLink,
            iconLabel,
            iconComponent: IconComponent,
            videoComponent: VideoComponent,
            videoSrc,
          } = deviceSection;
          return (
            <DeviceSection key={heading}>
              <DeviceDescription>
                <Heading>{heading}</Heading>
                <TextDescription>
                  {description} {descriptionLink ? descriptionLink : null}
                </TextDescription>
                {iconLink ? (
                  <StoreIcons>
                    <IconComponent
                      target="_blank"
                      rel="noopener noreferrer"
                      href={iconLink}
                    >
                      {' '}
                      {iconLabel}
                    </IconComponent>
                  </StoreIcons>
                ) : null}
              </DeviceDescription>
              <ImgContainer>
                <VideoComponent
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsinline
                />
              </ImgContainer>
            </DeviceSection>
          );
        })}
    </div>
  );
};

Devices.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Devices;
