import React from 'react';
import BrowseSkillByLanguage from '../../../components/cms/BrowseSkill/BrowseSkillByLanguage';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<BrowseSkillByLanguage />', () => {
  it('render BrowseSkillByLanguage without crashing', () => {
    shallow(
      <Provider store={store}>
        <BrowseSkillByLanguage />
      </Provider>,
    );
  });
});
