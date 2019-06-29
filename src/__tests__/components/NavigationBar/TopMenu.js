import React from 'react';
import TopMenu from '../../../components/NavigationBar/TopMenu';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<TopMenu />', () => {
  it('renders TopMenu without crashing', () => {
    shallow(
      <Provider store={store}>
        <TopMenu />
      </Provider>,
    );
  });
});
