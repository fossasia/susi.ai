import React from 'react';
import ChatApp from './components/ChatApp/ChatApp.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MessageComposer />', () => {
  it('render ChatApp without crashing', () => {
    shallow(
      <Provider store={store}>
        <ChatApp />
      </Provider>,
    );
  });
});
