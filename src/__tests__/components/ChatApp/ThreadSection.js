import React from 'react';
import ThreadSection from '../../../components/ChatApp/ThreadSection.react';
import { shallow } from 'enzyme';

describe('<ThreadSection />', () => {
  it('render ThreadSection without crashing', () => {
    shallow(<ThreadSection />);
  });
});
