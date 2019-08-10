import React from 'react';
import SettingsTabWrapper from './SettingsTabWrapper';
import ConfigKeys from '../Admin/Settings/ConfigKeys';

const UserKeysTab = () => {
  return (
    <SettingsTabWrapper heading="User API Keys">
      <div>
        <div>
          <ConfigKeys apiType="user" />
        </div>
      </div>
    </SettingsTabWrapper>
  );
};

export default UserKeysTab;
