import React from 'react';
import EditUserRole from '../../../components/Admin/ListUser/EditUserRoleDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<EditUserRole />', () => {
  it('render EditUserRole without crashing', () => {
    shallow(
      <Provider store={store}>
        <EditUserRole />
      </Provider>,
    );
  });
});
