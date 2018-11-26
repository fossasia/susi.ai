import React from 'react';
import ForgotPassword from '../../../../components/Auth/ForgotPassword/ForgotPassword.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ForgotPassword />', () => {
  it('render ForgotPassword without crashing', () => {
    shallow(
      <Provider store={store}>
        <ForgotPassword />
      </Provider>,
    );
  });
});
