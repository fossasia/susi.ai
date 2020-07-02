import React from 'react';
import UpdateSystemSettings from '../../../../../components/Admin/Settings/ConfigKeys/UpdateSystemSettingsDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<UpdateSystemSettings />', () => {
  it('render UpdateSystemSettings without crashing', () => {
    shallow(
      <Provider store={store}>
        <UpdateSystemSettings />
      </Provider>,
    );
  });
});
