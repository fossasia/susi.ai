import React from 'react';
import Blog from '../../../components/Blog/Blog.react';
import { shallow } from 'enzyme';

 it('render without crashing',()=>{
   shallow(<Blog location={{'pathname': '/blog'}} />);
 });
