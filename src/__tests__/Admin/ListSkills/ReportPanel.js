import React from 'react';
import ReportPanel from '../../../components/Admin/ListSkills/ReportPanel';
import { shallow } from 'enzyme';

describe('<ReportPanel />', () => {
  it('render ReportPanel without crashing', () => {
    shallow(<ReportPanel />);
  });
});
