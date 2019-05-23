import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const HeadSection = styled.div`
  border-bottom: 1px solid #dfdfdf;
  background: #f7f7f7;
`;

const Container = styled.div`
  padding: 10%;
  text-align: center;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 100;
  margin: 0 auto;
  max-width: 62rem;
`;

const SubTitle = styled.p`
  font-size: 1.4rem;
  font-weight: 300;
  line-height: 2.3rem;
  margin: 1rem auto;
  max-width: 32rem;
  color: #414141;
`;

export const Header = ({ title, subtitle, children }) => (
  <HeadSection>
    <Container>
      <Title>{title}</Title>
      {subtitle && <SubTitle>{subtitle}</SubTitle>}
      {children}
    </Container>
  </HeadSection>
);

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.array,
};
