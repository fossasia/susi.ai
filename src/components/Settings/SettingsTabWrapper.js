import React from 'react';
import propTypes from 'prop-types';
import Translate from '../Translate/Translate.react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Divider } from './SettingStyles';

const Container = styled.div`
  text-align: left;
  padding: 24px;
`;

const HeadingContainer = styled.div`
  margin-bottom: 1rem;
`;

export const TabHeading = styled.div`
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
      <HeadingContainer>
        <TabHeading>
          <Translate text={heading} />
        </TabHeading>
        <Divider theme={theme} />
      </HeadingContainer>
      {children}
    </Container>
  );
};

SettingsTabWrapper.propTypes = {
  theme: propTypes.string,
  currTheme: propTypes.string,
  heading: propTypes.string.isRequired,
  children: propTypes.oneOfType([propTypes.array, propTypes.element]),
  // children: propTypes.array,
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
