import React from 'react';
import ConfirmDialog from '../../../components/shared/Dialog/dialogTypes/ConfirmDialog';
import { shallow } from 'enzyme';

describe('<ConfirmDialog />', () => {
  it('render ConfirmDialog without crashing', () => {
    shallow(<ConfirmDialog />);
  });
});
