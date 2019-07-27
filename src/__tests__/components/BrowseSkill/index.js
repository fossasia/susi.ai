import React from 'react';
import BrowseSkill from '../../../components/cms/BrowseSkill';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<BrowseSkill />', () => {
  it('render BrowseSkill without crashing', () => {
    shallow(
      <Provider store={store}>
        <BrowseSkill />
      </Provider>,
    );
  });
});
