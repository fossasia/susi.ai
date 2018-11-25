import React from 'react';
import TopBar from '../../../components/ChatApp/TopBar.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});

describe('<TopBar />', () => {
  it('render TopBar without crashing', () => {
    shallow(
      <Provider store={store}>
        <TopBar />
      </Provider>,
    );
  });
});
