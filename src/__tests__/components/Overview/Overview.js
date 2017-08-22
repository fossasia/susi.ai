import React from 'react';
import Overview from '../../../components/Overview/Overview.react';
import { shallow } from 'enzyme';

it('render without crashing',()=>{
   shallow(<Overview location={{'pathname': '/overview'}} />);
});
