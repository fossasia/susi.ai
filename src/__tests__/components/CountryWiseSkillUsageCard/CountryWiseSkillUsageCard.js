import React from 'react';
import CountryWiseSkillUsageCard from '../../../components/cms/CountryWiseSkillUsageCard';
import { shallow } from 'enzyme';

describe('<CountryWiseSkillUsageCard />', () => {
  it('render CountryWiseSkillUsageCard without crashing', () => {
    shallow(<CountryWiseSkillUsageCard />);
  });
});
