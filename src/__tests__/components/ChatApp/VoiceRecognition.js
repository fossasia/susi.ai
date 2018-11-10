import React from 'react';
import VoiceRecognition from '../../../components/ChatApp/VoiceRecognition';
import { shallow } from 'enzyme';

describe('<VoiceRecognition />', () => {
  it('render VoiceRecognition without crashing', () => {
    shallow(<VoiceRecognition />);
  });
});
