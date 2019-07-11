import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../redux/actions/ui';
import Button from '@material-ui/core/Button';
import './NotFound.css';
import LogoImg from '../../images/susi-logo.svg';
import styled from 'styled-components';

const SusiLogo = styled.img.attrs({
  alt: 'Page Not Found',
  src: LogoImg,
})`
  width: 11rem;
`;

const LoginText = styled.p`
  font-size: 60px;
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
    <div className="not-found-banner">
      <Link to={'/'}>
        <SusiLogo />
      </Link>
      <RenderText renderLogin={renderLogin} />
      <div className="button-wrapper">
        <Link
          style={{ textDecoration: 'none' }}
          to={'/'}
          className="actionButton"
        >
          <Button
            variant="contained"
            color="primary"
            className="notfound-button"
          >
            Chat With SUSI
          </Button>
        </Link>
        <br />
        {!accessToken && (
          <div>
            <Button
              className="notfound-button"
              onClick={() => actions.openModal({ modalType: 'signUp' })}
              variant="contained"
              color="primary"
            >
              SignUp to SUSI
            </Button>
            <br />
            <Button
              className="notfound-button"
              variant="contained"
              color="primary"
              onClick={() => actions.openModal({ modalType: 'login' })}
            >
              Login to SUSI
            </Button>
          </div>
        )}
      </div>
    </div>
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
