import React from 'react';
import MessageSection from '../../components/MessageSection.react';
import { shallow } from 'enzyme';

it('render MessageListItem without crashing', () => {
  shallow(<MessageSection />);
})

