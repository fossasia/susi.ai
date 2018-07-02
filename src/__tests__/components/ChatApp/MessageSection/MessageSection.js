import React from 'react';
import MessageSection from '../../../../components/ChatApp/MessageSection/MessageSection.react';
import { shallow } from 'enzyme';

it('render MessageSection without crashing', () => {
  shallow(<MessageSection />);
});
