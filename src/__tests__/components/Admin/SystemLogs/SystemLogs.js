import React from 'react';
import SystemLogs from '../../../components/Admin/SystemLogs/SystemLogs';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SystemLogs />', () => {
  it('render SystemLogs without crashing', () => {
    shallow(
      <Provider store={store}>
        <SystemLogs />
      </Provider>,
    );
  });
});
