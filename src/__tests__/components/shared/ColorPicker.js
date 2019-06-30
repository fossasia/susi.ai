import React from 'react';
import ColorPicker from '../../../components/shared/ColorPicker';
import { shallow } from 'enzyme';

describe('<ColorPicker />', () => {
  it('render ColorPicker without crashing', () => {
    shallow(<ColorPicker />);
  });
});
