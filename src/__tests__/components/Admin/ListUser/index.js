import React from 'react';
import ListUser from '../../../components/Admin/ListUser';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ListUser />', () => {
  it('render ListUser without crashing', () => {
    shallow(
      <Provider store={store}>
        <ListUser />
      </Provider>,
    );
  });
});
