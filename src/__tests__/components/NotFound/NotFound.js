import React from 'react';
import NotFound from '../../../components/NotFound/NotFound.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<NotFound location={{'pathname': ''}} />);
 });
