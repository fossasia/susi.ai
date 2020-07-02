import React from 'react';
import CloseButton from '../../../components/shared/CloseButton';
import { shallow } from 'enzyme';

describe('<CloseButton />', () => {
  it('renders CloseButton without crashing', () => {
    shallow(<CloseButton />);
  });
});
