import React from 'react';
import AdminTab from '../../../components/Admin/AdminTab';
import { shallow } from 'enzyme';

describe('<AdminTab />', () => {
  it('render AdminTab without crashing', () => {
    shallow(<AdminTab />);
  });
});
