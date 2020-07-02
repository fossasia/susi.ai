import React from 'react';
import ChangePassword from '../../../../components/Auth/ChangePassword/ChangePassword.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ChangePassword />', () => {
  it('render ChangePassword without crashing', () => {
    shallow(
      <Provider store={store}>
        <ChangePassword />
      </Provider>,
    );
  });
});
