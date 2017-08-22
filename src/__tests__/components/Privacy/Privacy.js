import React from 'react';
import Privacy from '../../../components/Privacy/Privacy.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<Privacy location={{'pathname': '/privacy'}} />);
 });
