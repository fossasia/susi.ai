import React from 'react';
import TableComplex from '../../../components/TableComplex/TableComplex.react';
import { shallow } from 'enzyme';

it('render without crashing', () => {
  shallow(<TableComplex />);
});
