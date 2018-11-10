import React from 'react';
import StaticAppBar from '../../../components/StaticAppBar/StaticAppBar.react';
import { shallow } from 'enzyme';

describe('<StaticAppBar />', () => {
  it('renders StaticAppBar without crashing', () => {
    shallow(<StaticAppBar location={{ pathname: '' }} />);
  });
});
