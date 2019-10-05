import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { setRecaptchaConfig } from '../../../../apis';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import uiActions from '../../../../redux/actions/ui';
import appActions from '../../../../redux/actions/app';

const Paper = styled(_Paper)`
  max-width: 100%;
  padding: 1rem;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
`;

const H3 = styled.h3`
  margin: 1rem 0;
`;

const RecaptchaOptions = ({ actions, captchaConfig }) => {
  const handleRecaptchaChange = async e => {
    const { checked, name } = e.target;
    try {
      await setRecaptchaConfig({
        key: name,
        value: checked,
      });
      actions.getCaptchaConfig();
      actions.openSnackBar({
        snackBarMessage: 'Successfully changed reCaptcha settings',
      });
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: 'Failed to change reCaptcha settings',
      });
    }
  };
  const { login, signUp, changePassword } = captchaConfig;
  return (
    <Paper>
      <H3>ReCaptcha Configuration</H3>
      <div>
        <FormControlLabel
          value={login}
          control={
            <Checkbox
              color="primary"
              checked={login}
              name="login"
              onChange={handleRecaptchaChange}
            />
          }
          label="Login"
          labelPlacement="end"
          onChange={handleRecaptchaChange}
        />
      </div>
      <div>
        <FormControlLabel
          value={signUp}
          control={
            <Checkbox
              color="primary"
              name="signUp"
              checked={signUp}
              onChange={handleRecaptchaChange}
            />
          }
          label="Sign Up"
          labelPlacement="end"
        />
      </div>
      <div>
        <FormControlLabel
          value={changePassword}
          control={
            <Checkbox
              color="primary"
              name="changePassword"
              checked={changePassword === true}
              onChange={handleRecaptchaChange}
            />
          }
          label="Change Password"
          labelPlacement="end"
        />
      </div>
    </Paper>
  );
};

RecaptchaOptions.propTypes = {
  actions: PropTypes.object,
  captchaConfig: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    captchaConfig: store.app.captchaConfig,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...uiActions, ...appActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecaptchaOptions);
