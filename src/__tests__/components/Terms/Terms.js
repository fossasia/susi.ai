import React from 'react';
import Terms from '../../../components/Terms/Terms.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<Terms location={{'pathname': '/terms'}} />);
 });
