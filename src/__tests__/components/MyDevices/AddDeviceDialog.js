import React from 'react';
import AddDevice from '../../../components/cms/MyDevices/AddDeviceDialog';
import { shallow } from 'enzyme';

describe('<AddDevice />', () => {
  it('render AddDevice without crashing', () => {
    shallow(<AddDevice />);
  });
});
