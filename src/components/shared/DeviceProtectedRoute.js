import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import LogoImg from '../../images/susi-logo.svg';
import styled from 'styled-components';
import _Button from '@material-ui/core/Button';
import urls from '../../utils/urls';

const Button = styled(_Button)`
  width: 332px;
  margin-top: 2rem;
  @media (max-width: 356px) {
    width: 100%;
  }
`;

const SusiLogo = styled.img.attrs({
  alt: 'Page Not Found',
  src: LogoImg,
})`
  width: 15rem;
  margin-bottom: 2rem;
`;

const Container = styled.div`
  min-height: 74vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  h2 {
    font-size: 24px;
    line-height: 1.45;
  }
`;

const RenderAccessFromSUSI = ({ pathname }) => {
  return (
    <Container>
      <a href={urls.HOME_URL}>
        <SusiLogo />
      </a>
      <h2>
        Access to this page is restricted from local device
        <br />
        Try accessing from public SUSI.AI site
      </h2>
      <a href={`${urls.HOME_URL}${pathname}`}>
        <Button variant="contained" color="primary">
          Access from SUSI.AI
        </Button>
      </a>
    </Container>
  );
};

RenderAccessFromSUSI.propTypes = {
  pathname: PropTypes.string,
};

const DeviceProtectedRoute = (props) => {
  const { isLocalEnv, component: Component, location, ...restProps } = props;
  return (
    <Route
      {...restProps}
      render={(routeProps) =>
        !isLocalEnv ? (
          <Component {...routeProps} />
        ) : (
          <RenderAccessFromSUSI pathname={location.pathname} />
        )
      }
    />
  );
};

DeviceProtectedRoute.propTypes = {
  history: PropTypes.object,
  component: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.string,
  ]),
  isLocalEnv: PropTypes.bool,
  location: PropTypes.object,
};

function mapStateToProps(store) {
  const { isLocalEnv } = store.app;
  return {
    isLocalEnv,
  };
}

export default connect(mapStateToProps, null)(DeviceProtectedRoute);
