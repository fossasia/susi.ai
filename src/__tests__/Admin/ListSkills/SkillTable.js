import React from 'react';
import SkillTable from '../../../components/Admin/ListSkills/SkillTable';
import { shallow } from 'enzyme';

describe('<SkillTable />', () => {
  it('render SkillTable without crashing', () => {
    shallow(<SkillTable />);
  });
});
