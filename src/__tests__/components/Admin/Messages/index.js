import React from 'react';
import Messages from '../../../../components/Admin/Messages/index.js';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Messages />', () => {
  it('render Messages without crashing', () => {
    shallow(
      <Provider store={store}>
        <Messages />
      </Provider>,
    );
  });
});
