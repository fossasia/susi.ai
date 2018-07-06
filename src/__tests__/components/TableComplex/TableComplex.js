import React from 'react';
import TableComplex from '../../../components/TableComplex/TableComplex.react';
import { shallow } from 'enzyme';

describe('<TableComplex />', () => {
  it('renders TableComplexwithout crashing', () => {
    shallow(<TableComplex />);
  });
});
