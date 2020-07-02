import React from 'react';
import Login from '../../../../components/Auth/Login/Login.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Login />', () => {
  it('render Login without crashing', () => {
    shallow(
      <Provider store={store}>
        <Login />
      </Provider>,
    );
  });
});
