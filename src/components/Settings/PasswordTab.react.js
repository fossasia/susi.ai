import React from 'react';
import SettingsTabWrapper from './SettingsTabWrapper';
import ChangePassword from '../Auth/ChangePassword/ChangePassword.react';

const PasswordTab = () => {
  return (
    <SettingsTabWrapper heading="Password">
      <ChangePassword />
    </SettingsTabWrapper>
  );
};

export default PasswordTab;
