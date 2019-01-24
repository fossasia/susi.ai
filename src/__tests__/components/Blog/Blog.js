import React from 'react';
import Blog from '../../../components/Blog/Blog.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Login />', () => {
  it('render Login without crashing', () => {
    shallow(
      <Provider store={store}>
        <Blog location={{ pathname: '/blog' }} />
      </Provider>,
    );
  });
});
