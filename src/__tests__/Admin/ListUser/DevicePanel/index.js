import React from 'react';
import DevicePanel from '../../../../components/Admin/ListUser/DevicePanel';
import { shallow } from 'enzyme';

describe('<DevicePanel />', () => {
  it('render DevicePanel without crashing', () => {
    shallow(<DevicePanel />);
  });
});
