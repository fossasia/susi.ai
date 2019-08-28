import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../redux/actions/ui';
import _Button from '@material-ui/core/Button';
import LogoImg from '../../images/susi-logo.svg';
import styled from 'styled-components';

const SusiLogo = styled.img.attrs({
  alt: 'Page Not Found',
  src: LogoImg,
})`
  width: 11rem;
`;

const LoginText = styled.p`
  font-size: 3.75rem;
  @media (max-width: 650px) {
    font-size: 2.5rem;
    margin-top: 0.5rem;
  }
`;

const Button = styled(_Button)`
  width: 300px;
  margin-top: 0.7rem;
  @media (max-width: 356px) {
    width: 100%;
    margin-top: 0.7rem;
  }
`;

const Container = styled.div`
  text-align: center;
  margin: 0 auto;
  background-size: cover;
  min-height: 74vh;
  width: 100%;
  position: relative;
  top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 72px;
    margin: 0px 0 23px 0;
  }
  h2 {
    font-size: 22px;
    letter-spacing: 10px;
  }
  h2 a img {
    width: 180px;
    margin: 75px 0 -5px 0;
  }
`;

const RenderText = ({ renderLogin }) => {
  if (!renderLogin) {
    return (
      <React.Fragment>
        <h1>404</h1>
        <h2>Page not found</h2>
      </React.Fragment>
    );
  }
  return <LoginText>Please login to access this page</LoginText>;
};

RenderText.propTypes = {
  renderLogin: PropTypes.bool,
};

const NotFound = ({ accessToken, actions, renderLogin = false }) => {
  return (
    <Container>
      <Link to={'/'}>
        <SusiLogo />
      </Link>
      <RenderText renderLogin={renderLogin} />
      <Link style={{ textDecoration: 'none' }} to={'/'}>
        <Button variant="contained" color="primary">
          Chat With SUSI
        </Button>
      </Link>
      {!accessToken && (
        <div>
          <Button
            onClick={() => actions.openModal({ modalType: 'signUp' })}
            variant="contained"
            color="primary"
          >
            SignUp to SUSI
          </Button>
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={() => actions.openModal({ modalType: 'login' })}
          >
            Login to SUSI
          </Button>
        </div>
      )}
    </Container>
  );
};

NotFound.propTypes = {
  accessToken: PropTypes.string,
  history: PropTypes.object,
  actions: PropTypes.object,
  renderLogin: PropTypes.bool,
};

function mapStateToProps(store) {
  const { accessToken } = store.app;
  return {
    accessToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotFound);
