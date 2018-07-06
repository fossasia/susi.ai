import React from 'react';
import Team from '../../../components/Team/Team.react';
import { shallow } from 'enzyme';

describe('<Team />', () => {
  it('render Team without crashing', () => {
    shallow(<Team location={{ pathname: '/team' }} />);
  });
});
