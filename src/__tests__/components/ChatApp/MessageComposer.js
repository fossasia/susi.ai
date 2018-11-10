import React from 'react';
import MessageComposer from '../../../components/ChatApp/MessageComposer.react';
import { shallow } from 'enzyme';

describe('<MessageComposer />', () => {
  it('render MessageComposer without crashing', () => {
    shallow(<MessageComposer threadID="t_1" />);
  });
});
