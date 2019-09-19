import React from 'react';
import LeftMenu from '../../../components/NavigationBar/LeftMenu';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});
describe('<LeftMenu />', () => {
  it('renders LeftMenu without crashing', () => {
    shallow(
      <Provider store={store}>
        <LeftMenu />
      </Provider>,
    );
  });
});
