import React from 'react';
import OutlinedTextField from '../../../components/shared/OutlinedTextField';
import { shallow } from 'enzyme';

describe('<OutlinedTextField />', () => {
  it('render OutlinedTextField without crashing', () => {
    shallow(<OutlinedTextField />);
  });
});
