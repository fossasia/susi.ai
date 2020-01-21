import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import isMobileView from '../../../utils/isMobileView';

const Container = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  width: 260px;
  height: '100%';
  margin: 8px;
  border: 0.5px solid #eaeded;
`;

const loaderLimit = () => {
  const innerWidth = window.innerWidth;
  let limit = 2;
  if (innerWidth >= 1680) {
    limit = 6;
  } else if (innerWidth >= 1400) {
    limit = 5;
  } else if (innerWidth >= 1120) {
    limit = 4;
  } else if (innerWidth >= 840) {
    limit = 3;
  }
  return limit;
};

const addLoader = () => {
  const loader = [];
  const limit = loaderLimit();
  for (let i = 0; i < limit; i++) {
    loader.push(
      <ContentContainer key={i}>
        <ContentLoader width={260} height={168} speed={2}>
          <circle cx="44" cy="46" r="28" />
          <rect x="100" y="24" rx="4" ry="4" width="120" height="44" />
          <rect x="10" y="120" rx="8" ry="8" width="180" height="10" />
          <rect x="10" y="140" rx="8" ry="8" width="120" height="10" />
        </ContentLoader>
      </ContentContainer>,
    );
  }
  return loader;
};

const SkillLoader = () => {
  const isMobile = isMobileView();
  return (
    <>
      <ContentLoader
        height={isMobile ? 240 : 320}
        width={950}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <rect
          x={isMobile ? '30' : '1'}
          y="2"
          rx="0"
          ry="0"
          width={isMobile ? '100' : '30'}
          height="290"
        />
        <rect
          x={isMobile ? '820' : '860'}
          y="1"
          rx="0"
          ry="0"
          width={isMobile ? '100' : '30'}
          height="290"
        />
        <rect
          x={isMobile ? '150' : '40'}
          y="2"
          rx="0"
          ry="0"
          width={isMobile ? '650' : '810'}
          height="290"
        />
      </ContentLoader>
      <Container>{addLoader()}</Container>
      <Container>{addLoader()}</Container>
      <Container>{addLoader()}</Container>
    </>
  );
};

export default SkillLoader;
