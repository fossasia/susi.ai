import React from 'react';
import SkillHistory from '../../../components/cms/SkillHistory/SkillHistory';
import { shallow } from 'enzyme';

describe('<SkillHistory />', () => {
  it('render SkillHistory without crashing', () => {
    shallow(
      <SkillHistory
        location={{
          pathname: '/skills/:category/:skill/compare/:lang/:oldid/:recentid',
        }}
      />,
    );
  });
});
