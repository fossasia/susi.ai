import React from 'react';
import DevicePanel from '../../../../../components/Admin/ListUser/DevicePanel';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<DevicePanel />', () => {
  it('render DevicePanel without crashing', () => {
    shallow(
      <Provider store={store}>
        <DevicePanel />
      </Provider>,
    );
  });
});
