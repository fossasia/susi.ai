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

const NotFoundText = styled.div`
  #notfound {
    position: relative;
    height: 50vh;
    margin-top: 40px;
  }

  #notfound .notfound {
    position: relative;
    left: 50%;
    top: 40%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .notfound {
    max-width: 920px;
    width: 100%;
    line-height: 1.4;
    text-align: center;
    padding-left: 15px;
    padding-right: 15px;
  }

  .notfound .notfound-404 {
    position: absolute;
    height: 100px;
    top: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    z-index: -1;
  }

  .notfound .notfound-404 h1 {
    color: #ececec;
    font-weight: 900;
    font-size: 276px;
    margin: 0px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .notfound h2 {
    font-size: 46px;
    color: #000;
    font-weight: 900;
    text-transform: uppercase;
    margin: 0px;
  }

  @media only screen and (max-width: 480px) {
    .notfound .notfound-404 h1 {
      font-size: 162px;
    }
    .notfound h2 {
      font-size: 26px;
    }
  }
`;

const RenderText = ({ renderLogin }) => {
  if (!renderLogin) {
    return (
      <NotFoundText>
        <div id="notfound">
          <div className="notfound">
            <div className="notfound-404">
              <h1>404</h1>
            </div>
            <h2>We are sorry, Page not found!</h2>
          </div>
        </div>
      </NotFoundText>
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
          Back To Homepage
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
