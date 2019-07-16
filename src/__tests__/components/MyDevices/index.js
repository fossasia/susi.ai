import React from 'react';
import MyDevices from '../../../components/cms/MyDevices';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MyDevices />', () => {
  it('render MyDevices without crashing', () => {
    shallow(
      <Provider store={store}>
        <MyDevices />
      </Provider>,
    );
  });
});
