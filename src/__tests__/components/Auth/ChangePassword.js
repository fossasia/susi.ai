import React from 'react';
import ChangePassword from '../../../components/Auth/ChangePassword/ChangePassword.react';
import { shallow } from 'enzyme';

 it('render ChangePassword without crashing',()=>{
   shallow(<ChangePassword />);
 });
