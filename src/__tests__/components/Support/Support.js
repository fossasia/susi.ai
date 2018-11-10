import React from 'react';
import Support from '../../../components/Support/Support.react';
import { shallow } from 'enzyme';

describe('<Support />', () => {
  it('renders Support without crashing', () => {
    shallow(<Support location={{ pathname: '/support' }} />);
  });
});
