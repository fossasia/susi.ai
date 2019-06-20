import React from 'react';
import EditSkill from '../../../components/Admin/ListSkills/EditSkillDialog';
import { shallow } from 'enzyme';

describe('<EditSkill />', () => {
  it('render EditSkill without crashing', () => {
    shallow(<EditSkill />);
  });
});
