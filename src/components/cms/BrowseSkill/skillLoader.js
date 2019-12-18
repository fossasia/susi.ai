import React from 'react';
import _ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import isMobileView from '../../../utils/isMobileView';

const Container = styled.div`
  display: flex;
`;

const ContentLoader = styled(_ContentLoader)`
  width: 260px;
  height: 168px;
  margin: 20px;
`;

const addLoader = () => {
  const loader = [];
  const limit = isMobileView() ? 2 : 4;
  for (let i = 0; i < limit; i++) {
    loader.push(
      <ContentLoader speed={2}>
        <circle cx="28" cy="28" r="28" />
        <rect x="75" y="14" rx="4" ry="4" width="140" height="30" />
        <rect x="0" y="80" rx="8" ry="8" width="200" height="8" />
        <rect x="0" y="100" rx="8" ry="8" width="120" height="8" />
      </ContentLoader>,
    );
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
