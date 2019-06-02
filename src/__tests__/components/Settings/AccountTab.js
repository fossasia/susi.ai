import React from 'react';
import AccountTab from '../../../components/Settings/AccountTab.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<AccountTab />', () => {
  it('render AccountTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <AccountTab />
      </Provider>,
    );
  });
});
