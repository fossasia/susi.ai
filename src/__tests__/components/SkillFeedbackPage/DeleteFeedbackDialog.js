import React from 'react';
import DeleteFeedback from '../../../components/cms/SkillFeedbackPage/DeleteFeedbackDialog';
import { shallow } from 'enzyme';

describe('<DeleteFeedback />', () => {
  it('render DeleteFeedback without crashing', () => {
    shallow(<DeleteFeedback />);
  });
});
