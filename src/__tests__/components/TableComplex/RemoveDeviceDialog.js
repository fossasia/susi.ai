import React from 'react';
import RemoveDeviceDialog from '../../../components/TableComplex/RemoveDeviceDialog.react';
import { shallow } from 'enzyme';

it('render without crashing', () => {
  shallow(<RemoveDeviceDialog />);
});
