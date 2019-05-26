import React from 'react';
import SpeechTab from '../../../../components/ChatApp/Settings/SpeechTab.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SpeechTab />', () => {
  it('render SpeechTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <SpeechTab />
      </Provider>,
    );
  });
});
