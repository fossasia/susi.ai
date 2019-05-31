import React from 'react';
import BotBuilder from '../../../components/cms/BotBuilder/BotBuilder';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<BotBuilder />', () => {
  it('render BotBuilder without crashing', () => {
    shallow(
      <Provider store={store}>
        <BotBuilder />
      </Provider>,
    );
  });
});
