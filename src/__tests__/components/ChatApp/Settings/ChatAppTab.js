import React from 'react';
import ChatAppTab from '../../../../components/ChatApp/Settings/ChatAppTab.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ChatAppTab />', () => {
  it('render ChatAppTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <ChatAppTab />
      </Provider>,
    );
  });
});
