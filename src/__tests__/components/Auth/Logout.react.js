import React from 'react';
import Logout from '../../../components/Auth/Logout.react';
import { shallow } from 'enzyme';

it('render Logout without crashing', () => {
  shallow(<Logout />);
});
