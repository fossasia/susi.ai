import React from 'react';
import NotFound from '../../../components/NotFound/NotFound.react';
import { shallow } from 'enzyme';

describe('<NotFound />', () => {
  it('renders NotFound without crashing', () => {
    shallow(<NotFound location={{ pathname: '' }} />);
  });
});
