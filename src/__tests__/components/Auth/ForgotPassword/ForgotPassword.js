import React from 'react';
import ForgotPassword from '../../../../components/Auth/ForgotPassword/ForgotPassword.react';
import { shallow } from 'enzyme';

describe('<ForgotPassword />', () => {
  it('render ForgotPassword without crashing', () => {
    shallow(<ForgotPassword />);
  });
});
