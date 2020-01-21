import React from 'react';
import AdminTab from '../../../../components/Admin/AdminTab/AdminTab';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<AdminTab />', () => {
  it('render AdminTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <AdminTab />
      </Provider>,
    );
  });
});
