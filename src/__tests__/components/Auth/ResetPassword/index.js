import React from 'react';
import ResetPassword from '../../../../components/Auth/ResetPassword';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ResetPassword />', () => {
  it('render ResetPassword without crashing', () => {
    shallow(
      <Provider store={store}>
        <ResetPassword />
      </Provider>,
    );
  });
});
