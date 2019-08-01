import React from 'react';
import EditDeviceSettings from '../../../../components/Admin/ListUser/DevicePanel/EditDeviceDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<EditDeviceSettings />', () => {
  it('render EditDeviceSettings without crashing', () => {
    shallow(
      <Provider store={store}>
        <EditDeviceSettings />
      </Provider>,
    );
  });
});
