import React from 'react';
import CircularLoader from '../../../components/shared/CircularLoader';
import { shallow } from 'enzyme';

describe('<CircularLoader />', () => {
  it('render CircularLoader without crashing', () => {
    shallow(<CircularLoader />);
  });
});
