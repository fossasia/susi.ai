import React from 'react';
import RestoreSkill from '../../../components/Admin/ListSkills/RestoreSkillDialog';
import { shallow } from 'enzyme';

describe('<RestoreSkill />', () => {
  it('render RestoreSkill without crashing', () => {
    shallow(<RestoreSkill />);
  });
});
