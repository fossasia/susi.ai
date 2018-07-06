import React from 'react';
import ChangePassword from '../../../../components/Auth/ChangePassword/ChangePassword.react';
import { shallow } from 'enzyme';

describe('<ChangePassword />', () => {
  it('render ChangePassword without crashing', () => {
    shallow(<ChangePassword />);
  });
});
