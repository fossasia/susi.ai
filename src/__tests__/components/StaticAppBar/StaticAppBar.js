import React from 'react';
import StaticAppBar from '../../../components/StaticAppBar/StaticAppBar.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});
describe('<StaticAppBar />', () => {
  it('renders StaticAppBar without crashing', () => {
    shallow(
      <Provider store={store}>
        <StaticAppBar location={{ pathname: '' }} />
      </Provider>,
    );
  });
});
