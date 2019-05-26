import React from 'react';
import MobileTab from '../../../../components/ChatApp/Settings/MobileTab.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MobileTab />', () => {
  it('render MobileTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <MobileTab />
      </Provider>,
    );
  });
});
