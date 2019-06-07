import React from 'react';
import propTypes from 'prop-types';
import Translate from '../Translate/Translate.react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Divider } from './SettingStyles';

const Container = styled.div`
  text-align: left;
  padding: 20px;
  margin-left: 10px;
`;

export const Heading = styled.div`
  font-size: 1.5rem;
`;

const SettingsTabWrapper = ({
  theme: storeTheme,
  heading,
  children,
  currTheme,
}) => {
  const theme = currTheme ? currTheme : storeTheme;
  return (
    <Container>
      <span>
        <Heading>
          <Translate text={heading} />
        </Heading>
        <Divider theme={theme} />
      </span>
      {children}
    </Container>
  );
};

SettingsTabWrapper.propTypes = {
  theme: propTypes.string,
  currTheme: propTypes.string,
  heading: propTypes.string.isRequired,
  children: propTypes.array,
};

function mapStateToProps(store) {
  return {
    theme: store.settings.theme,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SettingsTabWrapper);
