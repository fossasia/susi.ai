import React from 'react';
import UpdateSystemSettings from '../../../components/Admin/SystemSettings/UpdateSystemSettingsDialog';
import { shallow } from 'enzyme';

describe('<UpdateSystemSettings />', () => {
  it('render UpdateSystemSettings without crashing', () => {
    shallow(<UpdateSystemSettings />);
  });
});
