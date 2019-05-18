import React from 'react';
import SettingsTabWrapper from './SettingsTabWrapper';
import ChangePassword from '../../Auth/ChangePassword/ChangePassword.react';
import PropTypes from 'prop-types';

const PasswordTab = props => {
  return (
    <SettingsTabWrapper heading="Password" theme={props.themeVal}>
      <ChangePassword settings={props.intialSettings} {...props} />
    </SettingsTabWrapper>
  );
};

PasswordTab.propTypes = {
  intialSettings: PropTypes.object,
  themeVal: PropTypes.string,
};

export default PasswordTab;
