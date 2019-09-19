import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: 3rem 0 -2.5rem 0;
  background: #4caf50;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  height: 40px;
`;

const ConfigureSpan = styled(Link)`
  text-decoration: underline;
  margin-left: 4px;
  cursor: pointer;
  color: #fff;
`;

const AppBanner = ({ macId }) => {
  return (
    <Container>
      You are currently accessing the local version of your SUSI.AI running on
      your smart device.
      <ConfigureSpan to={`/configure-speaker/${macId}`}>
        Configure now
      </ConfigureSpan>
    </Container>
  );
};

AppBanner.propTypes = {
  actions: PropTypes.object,
  macId: PropTypes.string,
};

export default AppBanner;
