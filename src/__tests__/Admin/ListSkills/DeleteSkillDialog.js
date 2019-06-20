import React from 'react';
import DeleteSkill from '../../../components/Admin/ListSkills/DeleteSkillDialog';
import { shallow } from 'enzyme';

describe('<DeleteSkill />', () => {
  it('render DeleteSkill without crashing', () => {
    shallow(<DeleteSkill />);
  });
});
