import React from 'react';
import Recaptcha from '../../../components/shared/Recaptcha';
import { shallow } from 'enzyme';

describe('<Recaptcha />', () => {
  it('render Recaptcha without crashing', () => {
    shallow(<Recaptcha />);
  });
});
