import React from 'react';
import TextToSpeechSettings from '../../../components/Settings/TextToSpeechSettings.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<TextToSpeechSettings />', () => {
  it('render TextToSpeechSettings without crashing', () => {
    shallow(
      <Provider store={store}>
        <TextToSpeechSettings />
      </Provider>,
    );
  });
});
