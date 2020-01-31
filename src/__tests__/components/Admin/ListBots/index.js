import React from 'react';
import ListBots from '../../../../components/Admin/ListBots/index';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ListBots />', () => {
  it('render ListBots without crashing', () => {
    shallow(
      <Provider store={store}>
        <ListBots />
      </Provider>,
    );
  });
});
