import React from 'react';
import Team from '../../../../components/About/Team';
import { shallow } from 'enzyme';

describe('<Team />', () => {
  it('render Team without crashing', () => {
    shallow(<Team location={{ pathname: '/team' }} />);
  });
});
