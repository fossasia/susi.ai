import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Header } from '../../shared/About';
import { scrollToTopAnimation } from '../../../utils/animateScroll';
import MapContainer from '../../cms/MyDevices/MapContainer';
import withGoogleApiWrapper from '../../../utils/withGoogleApiWrapper';

const Address = styled.div`
  height: 70vh;
  margin-bottom: 10px;
  border-bottom: 0.063rem solid #eee;
  position: relative;
  @media (max-width: 1000px) {
    height: 90vh;
  }
`;

const MapBox = styled.div`
  position: absolute;
  margin-bottom: 10vh;
`;

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

function renderTooltip(selectedPlace) {
  return <h3>{selectedPlace.title}</h3>;
}

const Contact = props => {
  document.title =
    'Contact Developer Team of SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  scrollToTopAnimation();
  document.body.style.setProperty('background-image', 'none');

  const { google, mapKey } = props;

  const locationFossasia = {
    deviceName: 'fossasia',
    latitude: 1.2879848,
    longitude: 103.84602,
    location: `${1.2879848}, ${103.84602}`,
  };

  return (
    <div>
      <Header
        title="Contact Us"
        subtitle="Get the help and information you need from our community and team
              through various channels."
      />
      <Section>
        <Address>
          <div>
            <H5>SUSI</H5>
            <Text>
              12 Eu Tong Sen Street
              <br />
              #8-169 ,
              <br />
              Singapore 059819
              <br />
              Phone +65 83435672
              <br />
              Email: support@susper.net
              <br />
              Board of Directors: Phuc Hong Dang
              <br />
            </Text>
          </div>
          <MapBox>
            {mapKey && (
              <MapContainer
                google={google}
                style={{
                  width: '65vw',
                }}
                tooltipRenderer={renderTooltip}
                data={[locationFossasia]}
              />
            )}
          </MapBox>
        </Address>
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
  google: PropTypes.object,
  mapKey: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    mapKey: store.app.apiKeys.mapKey || '',
  };
}

export default withRouter(
  connect(mapStateToProps)(withGoogleApiWrapper(Contact)),
);
