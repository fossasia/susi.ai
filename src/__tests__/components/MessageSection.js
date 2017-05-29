import React from 'react';
import MessageSection from '../../components/MessageSection.react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

it('render MessageListItem without crashing', () => {
  shallow(<MessageSection />);
})

