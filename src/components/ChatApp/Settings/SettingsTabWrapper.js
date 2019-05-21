import React from 'react';
import propTypes from 'prop-types';
import Translate from '../../Translate/Translate.react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: left;
  padding: 20px;
  margin-left: 10px;
`;

const TabHeading = styled.div`
  font-size: 1.5rem;
`;

const SettingsTabWrapper = ({ theme, heading, children }) => {
  return (
    <Container>
      <span>
        <TabHeading>
          <Translate text={heading} />
        </TabHeading>
        {theme === 'light' ? (
          <hr className="break-line-light" style={{ height: '2px' }} />
        ) : (
          <hr className="break-line-dark" />
        )}
      </span>
      {children}
    </Container>
  );
};

SettingsTabWrapper.propTypes = {
  theme: propTypes.string,
  heading: propTypes.string.isRequired,
  children: propTypes.array,
};

export default SettingsTabWrapper;
