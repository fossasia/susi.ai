import React from 'react';
import BrowseSkillByCategory from '../../../components/cms/BrowseSkill/BrowseSkillByCategory';
import { shallow } from 'enzyme';

describe('<BrowseSkillByCategory />', () => {
  it('render BrowseSkillByCategory without crashing', () => {
    shallow(<BrowseSkillByCategory />);
  });
});
