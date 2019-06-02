import React from 'react';
import Admin from '../../components/Admin/Admin';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Admin />', () => {
  it('render Admin without crashing', () => {
    shallow(
      <Provider store={store}>
        <Admin />
      </Provider>,
    );
  });
});
