import React from 'react';
import SkillFeedbackCard from '../../../components/cms/SkillFeedbackCard/SkillFeedbackCard';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillFeedbackCard />', () => {
  it('render SkillFeedbackCard without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillFeedbackCard />
      </Provider>,
    );
  });
});
