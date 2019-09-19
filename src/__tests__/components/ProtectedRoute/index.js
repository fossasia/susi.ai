import React from 'react';
import ProtectedRoute from '../../../components/shared/ProtectedRoute';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ProtectedRoute />', () => {
  it('render ProtectedRoute without crashing', () => {
    shallow(
      <Provider store={store}>
        <ProtectedRoute />
      </Provider>,
    );
  });
});
