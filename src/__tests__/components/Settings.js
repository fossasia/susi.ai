import React from 'react';
import Settings from '../../components/ChatApp/Settings.react';
import { shallow } from 'enzyme';

 it('render Settings without crashing',()=>{
   shallow(<Settings />);
 });
