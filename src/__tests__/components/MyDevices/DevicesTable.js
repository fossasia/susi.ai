import React from 'react';
import DevicesTable from '../../../components/cms/MyDevices/DevicesTable';
import { shallow } from 'enzyme';

describe('<DevicesTable />', () => {
  it('renders DevicesTable without crashing', () => {
    shallow(<DevicesTable />);
  });
});
