import React from 'react';
import ThreadSection from '../../../components/ChatApp/ThreadSection.react';
import { shallow } from 'enzyme';

it('render ThreadSection without crashing', () => {
  shallow(<ThreadSection />);
});
