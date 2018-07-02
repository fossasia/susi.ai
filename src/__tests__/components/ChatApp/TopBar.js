import React from 'react';
import TopBar from '../../../components/ChatApp/TopBar.react';
import { shallow } from 'enzyme';

it('render TopBar without crashing', () => {
  shallow(<TopBar />);
});
