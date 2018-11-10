import React from 'react';
import MessageSection from '../../../../components/ChatApp/MessageSection/MessageSection.react';
import { shallow } from 'enzyme';

describe('<MessageSection />', () => {
  it('render MessageSection without crashing', () => {
    shallow(<MessageSection />);
  });
});
