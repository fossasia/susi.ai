import React from 'react';
import ConfigKeys from '../../../../components/Admin/SystemSettings/ConfigKeys';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ConfigKeys />', () => {
  it('render ConfigKeys without crashing', () => {
    shallow(
      <Provider store={store}>
        <ConfigKeys />
      </Provider>,
    );
  });
});
