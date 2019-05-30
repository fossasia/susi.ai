import React from 'react';
import Alert from '../../../components/shared/Alert';
import { shallow } from 'enzyme';

describe('<Alert />', () => {
  it('render Alert without crashing', () => {
    shallow(<Alert />);
  });
});
