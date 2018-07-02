import React from 'react';
import FourButtons from '../../../components/Team/FourButtons.react';
import { shallow } from 'enzyme';

it('render FourButtons without crashing', () => {
  shallow(<FourButtons />);
});
