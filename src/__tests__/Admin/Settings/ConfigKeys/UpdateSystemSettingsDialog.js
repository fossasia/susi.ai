import React from 'react';
import UpdateSystemSettings from '../../../../components/Admin/Settings/ConfigKeys/UpdateSystemSettingsDialog';
import { shallow } from 'enzyme';

describe('<UpdateSystemSettings />', () => {
  it('render UpdateSystemSettings without crashing', () => {
    shallow(<UpdateSystemSettings />);
  });
});
