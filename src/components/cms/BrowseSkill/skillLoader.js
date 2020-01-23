import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import isMobileView from '../../../utils/isMobileView';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
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
      <ContentContainer key={i} width="260px" height="100%">
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

const SkillSearchLoader = () => {
  const loaderWidth = window.innerWidth;
  const isMobile = isMobileView();
  return (
    <ContentContainer width="100%" height="100%">
      <ContentLoader
        width={loaderWidth}
        height={isMobile ? 160 : 200}
        speed={2}
      >
        <rect
          x={isMobile ? '145' : '215'}
          y={isMobile ? '23' : '23'}
          rx="4"
          ry="4"
          width={isMobile ? '200' : '384'}
          height={isMobile ? '20' : '30'}
        />
        <rect
          x={isMobile ? '145' : '215'}
          y={isMobile ? '63' : '67'}
          rx="3"
          ry="3"
          width={isMobile ? '145' : '284'}
          height={isMobile ? '86' : '106'}
        />
        {loaderWidth <= 990 ? (
          ''
        ) : (
          <>
            <rect
              x={loaderWidth - 340}
              y="61"
              rx="3"
              ry="3"
              width="321"
              height="12"
            />
            <rect
              x={loaderWidth - 340}
              y="81"
              rx="3"
              ry="3"
              width="235"
              height="36"
            />
          </>
        )}
        <circle
          cx={isMobile ? '70' : '100'}
          cy={isMobile ? '86' : '106'}
          r={isMobile ? '57' : '87'}
        />
      </ContentLoader>
    </ContentContainer>
  );
};

const SkillLoader = props => {
  const isMobile = isMobileView();
  const { isSkillSearch } = props;
  return (
    <>
      {isSkillSearch ? (
        <div>
          <Container>{SkillSearchLoader()}</Container>
          <Container>{SkillSearchLoader()}</Container>
          <Container>{SkillSearchLoader()}</Container>
          <Container>{SkillSearchLoader()}</Container>
        </div>
      ) : (
        <div>
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
        </div>
      )}
    </>
  );
};

SkillLoader.propTypes = {
  isSkillSearch: PropTypes.bool,
};

export default SkillLoader;
