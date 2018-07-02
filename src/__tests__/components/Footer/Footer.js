import React from 'react';
import Footer from '../../../components/Footer/Footer.react';
import { shallow } from 'enzyme';

it('render without crashing', () => {
  shallow(<Footer />);
});
