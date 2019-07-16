import React from 'react';
import RemoveDeviceDialog from '../../../components/cms/MyDevices/RemoveDeviceDialog';
import { shallow } from 'enzyme';

describe('<RemoveDeviceDialog />', () => {
  it('renders RemoveDeviceDialog without crashing', () => {
    shallow(<RemoveDeviceDialog />);
  });
});
