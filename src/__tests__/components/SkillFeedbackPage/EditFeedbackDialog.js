import React from 'react';
import EditFeedback from '../../../components/cms/SkillFeedbackPage/EditFeedbackDialog';
import { shallow } from 'enzyme';

describe('<EditFeedback />', () => {
  it('render EditFeedback without crashing', () => {
    shallow(<EditFeedback />);
  });
});
