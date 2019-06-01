import React from 'react';
import Dashboard from '../../../components/cms/Dashboard/Dashboard';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Dashboard />', () => {
  it('render Dashboard without crashing', () => {
    shallow(
      <Provider store={store}>
        <Dashboard />
      </Provider>,
    );
  });
});
