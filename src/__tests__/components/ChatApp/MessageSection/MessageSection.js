import React from 'react';
import MessageSection from '../../../../components/ChatApp/MessageSection/MessageSection.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MessageSection />', () => {
  it('render MessageSection without crashing', () => {
    shallow(
      <Provider store={store}>
        <MessageSection />
      </Provider>,
    );
  });
});
