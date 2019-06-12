import React from 'react';
import ConfirmDeleteAccount from '../../../components/Auth/DeleteAccount/ConfirmDeleteAccount';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ConfirmDeleteAccount />', () => {
  it('render ConfirmDeleteAccount without crashing', () => {
    shallow(
      <Provider store={store}>
        <ConfirmDeleteAccount />
      </Provider>,
    );
  });
});
