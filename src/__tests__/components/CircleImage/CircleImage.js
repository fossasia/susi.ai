import React from 'react';
import CircleImage from '../../../components/cms/CircleImage/CircleImage';
import { shallow } from 'enzyme';

describe('<CircleImage />', () => {
  it('render CircleImage without crashing', () => {
    shallow(<CircleImage name="gender" size="48" />);
  });
});
