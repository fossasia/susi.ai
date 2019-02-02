import React from 'react';
import Settings from '../../../../components/ChatApp/Settings/Settings.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Settings />', () => {
  it('render Settings without crashing', () => {
    shallow(
      <Provider store={store}>
        <Settings />
      </Provider>,
    );
  });
});
