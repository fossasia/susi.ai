import React from 'react';
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

const AppBanner = () => {
  return (
    <Container>
      You are currently accessing the local version of your SUSI.AI running on
      your smart device
    </Container>
  );
};

export default AppBanner;
