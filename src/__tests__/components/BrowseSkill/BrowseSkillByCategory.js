import React from 'react';
import BrowseSkillByCategory from '../../../components/cms/BrowseSkill/BrowseSkillByCategory';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<BrowseSkillByCategory />', () => {
  it('render BrowseSkillByCategory without crashing', () => {
    shallow(
      <Provider store={store}>
        <BrowseSkillByCategory />
      </Provider>,
    );
  });
});
