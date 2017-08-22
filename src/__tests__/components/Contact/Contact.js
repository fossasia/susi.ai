import React from 'react';
import Contact from '../../../components/Contact/Contact.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<Contact location={{'pathname': '/contact'}} />);
 });
