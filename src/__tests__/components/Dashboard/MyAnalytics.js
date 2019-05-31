import React from 'react';
import MyAnalytics from '../../../components/cms/Dashboard/MyAnalytics';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MyAnalytics />', () => {
  it('render MyAnalytics without crashing', () => {
    shallow(
      <Provider store={store}>
        <MyAnalytics />
      </Provider>,
    );
  });
});
