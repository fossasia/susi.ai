import React from 'react';
import SignUp from '../../../../components/Auth/SignUp/SignUp.react';
import { shallow } from 'enzyme';

describe('<SignUp />', () => {
  it('render SignUp without crashing', () => {
    shallow(<SignUp />);
  });
});
