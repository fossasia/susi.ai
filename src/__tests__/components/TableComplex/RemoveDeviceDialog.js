import React from 'react';
import RemoveDeviceDialog from '../../../components/TableComplex/RemoveDeviceDialog.react';
import { shallow } from 'enzyme';

describe('<RemoveDeviceDialog />', () => {
  it('renders RemoveDeviceDialog without crashing', () => {
    shallow(<RemoveDeviceDialog />);
  });
});
