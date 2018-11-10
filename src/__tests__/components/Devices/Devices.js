import React from 'react';
import Devices from '../../../components/Devices/Devices.react';
import { shallow } from 'enzyme';

describe('<Devices />', () => {
  it('renders Devices without crashing', () => {
    shallow(<Devices location={{ pathname: '/devices' }} />);
  });
});
