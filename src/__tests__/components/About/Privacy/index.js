import React from 'react';
import Privacy from '../../../../components/About/Privacy';
import { shallow } from 'enzyme';

describe('<Privacy />', () => {
  it('renders Privacy without crashing', () => {
    shallow(<Privacy location={{ pathname: '/privacy' }} />);
  });
});
