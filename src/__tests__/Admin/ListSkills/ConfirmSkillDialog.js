import React from 'react';
import ConfirmSkill from '../../../components/Admin/ListSkills/ConfirmSkillDialog';
import { shallow } from 'enzyme';

describe('<ConfirmSkill />', () => {
  it('render ConfirmSkill without crashing', () => {
    shallow(<ConfirmSkill />);
  });
});
