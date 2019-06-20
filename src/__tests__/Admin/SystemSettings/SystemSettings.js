import React from 'react';
import SystemSettings from '../../../components/Admin/SystemSettings/SystemSettings';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SystemSettings />', () => {
  it('render SystemSettings without crashing', () => {
    shallow(
      <Provider store={store}>
        <SystemSettings />
      </Provider>,
    );
  });
});
