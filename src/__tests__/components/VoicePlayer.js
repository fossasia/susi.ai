import React from 'react';
import VoicePlayer from '../../components/ChatApp/MessageListItem/VoicePlayer';
import { shallow } from 'enzyme';

 it('render VoicePlayer without crashing',()=>{
   shallow(<VoicePlayer />);
 });
