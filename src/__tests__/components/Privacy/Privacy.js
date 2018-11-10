import React from 'react';
import Privacy from '../../../components/Privacy/Privacy.react';
import { shallow } from 'enzyme';

describe('<Privacy />', () => {
  it('renders Privacy without crashing', () => {
    shallow(<Privacy location={{ pathname: '/privacy' }} />);
  });
});
