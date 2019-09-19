import React from 'react';
import NavigationBar from '../../../components/NavigationBar';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});
describe('<NavigationBar />', () => {
  it('renders NavigationBar without crashing', () => {
    shallow(
      <Provider store={store}>
        <NavigationBar location={{ pathname: '' }} />
      </Provider>,
    );
  });
});
