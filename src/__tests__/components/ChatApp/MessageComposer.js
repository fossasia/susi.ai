import React from 'react';
import MessageComposer from '../../../components/ChatApp/MessageComposer.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MessageComposer />', () => {
  it('render MessageComposer without crashing', () => {
    shallow(
      <Provider store={store}>
        <MessageComposer threadID="t_1" />
      </Provider>,
    );
  });
});
