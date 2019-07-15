import React from 'react';
import DeleteAccount from '../../../components/Admin/ListUser/DeleteDialog';
import { shallow } from 'enzyme';

describe('<DeleteAccount />', () => {
  it('render DeleteAccount without crashing', () => {
    shallow(<DeleteAccount />);
  });
});
