import React from 'react';
import ThreadSection from '../../components/ChatApp/ThreadSection.react';
import { shallow } from 'enzyme';

 it('render ThreadListItem without crashing',()=>{
   shallow(<ThreadSection />);
 });
