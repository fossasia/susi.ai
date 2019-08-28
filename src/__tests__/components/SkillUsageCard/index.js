import React from 'react';
import SkillUsageCard from '../../../components/cms/SkillUsageCard/SkillUsageCard';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillUsageCard />', () => {
  it('render SkillUsageCard without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillUsageCard />
      </Provider>,
    );
  });
});
