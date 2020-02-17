import React from 'react';
import susi from '../../images/susi-logo.svg';
import { Link } from 'react-router-dom';
import urls from '../../utils/urls';
import isMobileView from '../../utils/isMobileView';
import styled from 'styled-components';

const FooterContainer = styled.div`
  background: #042658;
  width: 100%;
  z-index: 10;
  border: 1px solid #ddd;
  display: flex;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem 2rem 4.6rem;
  width: 100%;
  @media (max-width: 745px) {
    display: block;
  }
`;

const SusiLogoContainer = styled(Link)`
  @media (max-width: 745px) {
    display: flex;
    justify-content: center;
  }
`;

const SusiLogo = styled.img`
  height: 2rem;
  vertical-align: middle;
  max-width: 6.25rem;
  margin: 0.625rem 3rem 0.625rem 0rem;
  @media (max-width: 745px) {
    margin: 0.625rem;
  }
`;

const ContentContainer = styled.div`
  background: #042658;
  margin-top: 0px;
  min-height: 1.25rem;
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  @media (max-width: 745px) {
    padding-top: 0px;
    justify-content: center;
  }
  li {
    padding: 0.5rem;
  }
  li a {
    text-decoration: none;
    font-weight: 300;
    font-family: 'Roboto', sans-serif;
    cursor: pointer;
    color: #ffffff;
    font-size: 1rem;
  }
  li a:hover {
    text-shadow: 1px 1px 8px white;
  }
  ul {
    list-style: none;
    list-style-type: none;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    margin: 0.5rem;
    padding: 0;
  }
  @media (max-width: 745px) {
    ul {
      justify-content: center;
      margin: 0.2rem;
    }
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const getLinks = () => {
  let links = [],
    linksForMobileView = ['Privacy', 'Terms', 'Contact'];
  for (let i = 0; i < 3; i++) {
    links.push(
      <li key={i}>
        <Link to={'/' + linksForMobileView[i].toLowerCase()}>
          {linksForMobileView[i]}
        </Link>
      </li>,
    );
  }

  return links;
};

const Footer = () => {
  const isMobile = isMobileView();
  return (
    <FooterContainer>
      <FooterWrapper>
        <SusiLogoContainer to="/">
          <SusiLogo src={susi} alt="SUSI" />
        </SusiLogoContainer>
        <ContentContainer>
          <LeftContainer>
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/devices">Devices</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <a href={urls.API_URL}>API</a>
              </li>
              <li>
                <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi">
                  Code
                </a>
              </li>
              <li>
                <Link to="/team">Team</Link>
              </li>
              <li>
                <Link to="/support">Support</Link>
              </li>
              {isMobile && getLinks()}
            </ul>
          </LeftContainer>
          {!isMobile && (
            <ul>
              <li>
                <Link to="/privacy">Privacy</Link>
              </li>
              <li>
                <Link to="/terms">Terms</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          )}
        </ContentContainer>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;
