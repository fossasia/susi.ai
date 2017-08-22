import React from 'react';
import Support from '../../../components/Support/Support.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<Support location={{'pathname': '/support'}} />);
 });
