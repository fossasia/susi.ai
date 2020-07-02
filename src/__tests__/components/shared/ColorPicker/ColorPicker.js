import React from 'react';
import ColorPickerComponent from '../../../../components/shared/ColorPickerComponent';
import { shallow } from 'enzyme';

describe('<ColorPickerComponent />', () => {
  it('render ColorPickerComponent without crashing', () => {
    shallow(<ColorPickerComponent />);
  });
});
