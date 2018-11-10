import React from 'react';
import FourButtons from '../../../components/Team/FourButtons.react';
import { shallow } from 'enzyme';

describe('<FourButtons />', () => {
  it('render FourButtons without crashing', () => {
    shallow(<FourButtons />);
  });
});
