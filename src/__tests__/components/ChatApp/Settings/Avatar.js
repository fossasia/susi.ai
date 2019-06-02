import React from 'react';
import Avatar from '../../../../components/ChatApp/Settings/Avatar.js';
import { shallow } from 'enzyme';

describe('<Avatar />', () => {
  it('render Avatar without crashing', () => {
    shallow(<Avatar />);
  });
});
