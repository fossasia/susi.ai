import React from 'react';
import Settings from '../../../../components/Admin/Settings';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Settings />', () => {
  it('render Settings without crashing', () => {
    shallow(
      <Provider store={store}>
        <Settings />
      </Provider>,
    );
  });
});
