import React from 'react';
import ThreadListItem from '../../../components/ChatApp/ThreadListItem.react';
import { shallow } from 'enzyme';

it('render ThreadListItem without crashing', () => {
  shallow(<ThreadListItem />);
});
