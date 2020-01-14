import React from 'react';
import VoiceRecognition from '../../../components/ChatApp/VoiceRecognition';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<VoiceRecognition />', () => {
  it('render VoiceRecognition without crashing', () => {
    shallow(
      <Provider store={store}>
        <VoiceRecognition />
      </Provider>,
      { disableLifecycleMethods: true },
    );
  });
});
