import React from 'react';
import ListDevices from '../../../../components/Admin/ListDevices/index';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ListDevices />', () => {
  it('render ListDevices without crashing', () => {
    shallow(
      <Provider store={store}>
        <ListDevices />
      </Provider>,
    );
  });
});
