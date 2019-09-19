import React from 'react';
import Support from '../../../components/About/Support';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Support />', () => {
  it('renders Support without crashing', () => {
    shallow(
      <Provider store={store}>
        <Support location={{ pathname: '/support' }} />
      </Provider>,
    );
  });
});
