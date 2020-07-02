import React from 'react';
import MessageListItem from '../../../../components/ChatApp/MessageListItem/MessageListItem.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MessageListItem />', () => {
  it('render MessageListItem without crashing', () => {
    shallow(
      <Provider store={store}>
        <MessageListItem />
      </Provider>,
    );
  });
});
