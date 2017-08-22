import React from 'react';
import Team from '../../../components/Team/Team.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<Team location={{'pathname': '/team'}} />);
 });
