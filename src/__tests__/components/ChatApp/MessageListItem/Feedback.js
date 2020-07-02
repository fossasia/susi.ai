import React from 'react';
import Feedback from '../../../../components/ChatApp/MessageListItem/Feedback.react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Feedback />', () => {
  it('render Feedback without crashing', () => {
    shallow(
      <Provider store={store}>
        <Feedback />
      </Provider>,
    );
  });
});
