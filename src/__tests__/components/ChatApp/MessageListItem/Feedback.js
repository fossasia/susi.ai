import React from 'react';
import Feedback from '../../../../components/ChatApp/MessageListItem/Feedback.react';
import { shallow } from 'enzyme';

it('render Feedback without crashing', () => {
  shallow(<Feedback />);
});
