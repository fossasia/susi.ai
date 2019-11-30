import React from 'react';
import _ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import isMobileView from '../../../utils/isMobileView';

const Container = styled.div`
  display: flex;
`;

const ContentLoader = styled(_ContentLoader)`
  width: 280px;
  height: 168px;
  margin: 20px;
`;

const addLoader = () => {
  const loader = [];
  const limit = isMobileView() ? 2 : 4;
  for (let i = 0; i < limit; i++) {
    loader.push(
      <ContentLoader>
        <circle cx="34" cy="34" r="34" />
        <rect x="75" y="18" rx="4" ry="4" width="140" height="30" />
        <rect x="0" y="100" rx="5" ry="5" width="80" height="14" />
        <rect x="0" y="120" rx="5" ry="5" width="140" height="12" />
        <rect x="150" y="120" rx="5" ry="5" width="40" height="12" />
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
