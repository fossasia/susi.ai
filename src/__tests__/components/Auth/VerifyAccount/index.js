import React from 'react';
import VerifyAccount from '../../../../components/Auth/VerifyAccount';
import { shallow } from 'enzyme';

describe('<VerifyAccount />', () => {
  it('renders VerifyAccount without crashing', () => {
    shallow(<VerifyAccount />);
  });
});
