import React from 'react';
import CookiePolicy from '../../../components/CookiePolicy/CookiePolicy.react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<CookiePolicy />', () => {
  it('renders CookiePolicy without crashing', () => {
    shallow(
      <Provider store={store}>
        <CookiePolicy />
      </Provider>,
    );
  });
});
