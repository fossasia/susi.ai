import React from 'react';
import MessageListItem from '../../../../components/ChatApp/MessageListItem/MessageListItem.react';
import { shallow } from 'enzyme';

it('render MessageListItem without crashing', () => {
  shallow(<MessageListItem />);
});
