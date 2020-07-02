import React from 'react';
import SkillRating from '../../../components/cms/SkillRating/SkillRating';
import { shallow } from 'enzyme';

describe('<SkillRating />', () => {
  it('render SkillRating without crashing', () => {
    shallow(<SkillRating />);
  });
});
