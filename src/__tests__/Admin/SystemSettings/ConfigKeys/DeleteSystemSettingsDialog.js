import React from 'react';
import DeleteSystemSettings from '../../../../components/Admin/SystemSettings/ConfigKeys/DeleteSystemSettingsDialog';
import { shallow } from 'enzyme';

describe('<DeleteSystemSettings />', () => {
  it('render DeleteSystemSettings without crashing', () => {
    shallow(<DeleteSystemSettings />);
  });
});
