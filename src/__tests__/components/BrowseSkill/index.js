import React from 'react';
import BrowseSkill from '../../../components/cms/BotBuilder';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
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
