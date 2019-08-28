import React from 'react';
import Footer from '../../../components/Footer/Footer.react';
import { shallow } from 'enzyme';

describe('<Footer />', () => {
  it('renders Footer without crashing', () => {
    shallow(<Footer />);
  });
});
