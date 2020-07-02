import React from 'react';
import MicrophoneTab from '../../../components/Settings/MicrophoneTab.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MicrophoneTab />', () => {
  it('render MicrophoneTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <MicrophoneTab />
      </Provider>,
    );
  });
});
