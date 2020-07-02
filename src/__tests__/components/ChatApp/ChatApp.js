import React from 'react';
import ChatApp from '../../../components/ChatApp/ChatApp.react';
import { shallow } from 'enzyme';

describe('<MessageComposer />', () => {
  it('render ChatApp without crashing', () => {
    shallow(<ChatApp />);
  });
});
