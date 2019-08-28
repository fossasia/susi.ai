import React from 'react';
import BrowseSkillByLanguage from '../../../components/cms/BrowseSkill/BrowseSkillByLanguage';
import { shallow } from 'enzyme';

describe('<BrowseSkillByLanguage />', () => {
  it('render BrowseSkillByLanguage without crashing', () => {
    shallow(<BrowseSkillByLanguage />);
  });
});
