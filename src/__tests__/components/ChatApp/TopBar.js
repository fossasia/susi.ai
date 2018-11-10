import React from 'react';
import TopBar from '../../../components/ChatApp/TopBar.react';
import { shallow } from 'enzyme';

describe('<TopBar />', () => {
  it('render TopBar without crashing', () => {
    shallow(<TopBar />);
  });
});
