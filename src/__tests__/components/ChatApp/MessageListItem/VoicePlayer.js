import React from 'react';
import VoicePlayer from '../../../../components/ChatApp/MessageListItem/VoicePlayer.js';
import { shallow } from 'enzyme';

import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<VoicePlayer />', () => {
  it('render VoicePlayer without crashing', () => {
    shallow(
      <Provider store={store}>
        <VoicePlayer />
      </Provider>,
      { disableLifecycleMethods: true },
    );
  });
});
