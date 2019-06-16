import React from 'react';
import ReportSkill from '../../../components/cms/SkillPage/ReportSkillDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ReportSkill />', () => {
  it('render ReportSkill without crashing', () => {
    shallow(
      <Provider store={store}>
        <ReportSkill />
      </Provider>,
    );
  });
});
