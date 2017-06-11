import React from 'react';
import MessageSection from '../../components/ChatApp/MessageSection.react';
import { shallow } from 'enzyme';

it('render MessageListItem without crashing', () => {
  shallow(<MessageSection />);
})

