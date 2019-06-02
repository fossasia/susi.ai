import React from 'react';
import ListUser from '../../../components/Admin/ListUser/ListUser';
import { shallow } from 'enzyme';

describe('<ListUser />', () => {
  it('render ListUser without crashing', () => {
    shallow(<ListUser />);
  });
});
