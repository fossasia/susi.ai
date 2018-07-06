import React from 'react';
import Overview from '../../../components/Overview/Overview.react';
import { shallow } from 'enzyme';

describe('<Overview />', () => {
  it('renders Overview without crashing', () => {
    shallow(<Overview location={{ pathname: '/overview' }} />);
  });
});
