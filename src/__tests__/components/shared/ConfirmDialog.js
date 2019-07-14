import React from 'react';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import { shallow } from 'enzyme';

describe('<ConfirmDialog />', () => {
  it('render ConfirmDialog without crashing', () => {
    shallow(<ConfirmDialog />);
  });
});
