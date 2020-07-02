import React from 'react';
import ConversationView from '../../../../components/cms/SkillCreator/SkillViews/ConversationView';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ConversationView />', () => {
  it('render ConversationView without crashing', () => {
    shallow(
      <Provider store={store}>
        <ConversationView />
      </Provider>,
    );
  });
});
