import React from 'react';
import VoiceRecognition from '../../components/ChatApp/VoiceRecognition';
import { shallow } from 'enzyme';

 it('render VoiceRecognition without crashing',()=>{
   shallow(<VoiceRecognition />);
 });
