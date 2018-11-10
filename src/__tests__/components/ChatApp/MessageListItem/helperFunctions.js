import React from 'react';
import helperFunctions from '../../../../components/ChatApp/MessageListItem/helperFunctions.react';
import { shallow } from 'enzyme';

describe('<helperFunctions />', () => {
  it('render helperFunctions without crashing', () => {
    shallow(<helperFunctions />);
  });
});
