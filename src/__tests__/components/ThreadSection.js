import React from 'react';
import ThreadSection from '../../components/ThreadSection.react';
import { shallow } from 'enzyme';

 it('render ThreadListItem without crashing',()=>{
   shallow(<ThreadSection />);
 });
