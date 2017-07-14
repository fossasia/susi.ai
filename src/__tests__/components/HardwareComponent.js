import React from 'react';
import HardwareComponent from '../../components/ChatApp/HardwareComponent';
import { shallow } from 'enzyme';

 it('render HardwareComponent without crashing',()=>{
   shallow(<HardwareComponent />);
 });
