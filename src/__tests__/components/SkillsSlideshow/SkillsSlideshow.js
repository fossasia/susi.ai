import React from 'react';
import SkillSlideshow from '../../../components/cms/SkillSlideshow';
import { shallow } from 'enzyme';

describe('<SkillSlideshow />', () => {
  it('render SkillSlideshow without crashing', () => {
    shallow(<SkillSlideshow />);
  });
});
