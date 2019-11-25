import React from 'react';
import { Facebook } from 'react-content-loader';
import styled from 'styled-components';
import isMobileView from '../../../utils/isMobileView';

const Container = styled.div`
  display: flex;
`;

const Loader = styled(Facebook)`
  width: 260px;
  height: 168px;
  margin: 20px;
`;

const addLoader = () => {
  const loader = [];
  const limit = isMobileView() ? 2 : 4;
  for (let i = 0; i < limit; i++) {
    loader.push(<Loader />);
  }
  return loader;
};

const SkillLoader = () => {
  return (
    <div>
      <Container>{addLoader()}</Container>
      <Container>{addLoader()}</Container>
      <Container>{addLoader()}</Container>
    </div>
  );
};

export default SkillLoader;
