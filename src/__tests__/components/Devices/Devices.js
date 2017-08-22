import React from 'react';
import Devices from '../../../components/Devices/Devices.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<Devices location={{'pathname': '/devices'}} />);
 });
