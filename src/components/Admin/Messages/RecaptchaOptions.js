import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const RecaptchaOptions = ({ captchaConfig }) => {
  const { login, signUp, changePassword } = captchaConfig;
  return (
    <React.Fragment>
      {login && 'Login, '}
      {signUp && 'Sign Up, '}
      {changePassword && 'User Password'}
    </React.Fragment>
  );
};

RecaptchaOptions.propTypes = {
  captchaConfig: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    captchaConfig: store.app.captchaConfig,
  };
}

export default connect(mapStateToProps, null)(RecaptchaOptions);
