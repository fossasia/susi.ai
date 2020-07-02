import React from 'react';
import NotFound from '../../../components/NotFound/NotFound.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<NotFound />', () => {
  it('renders NotFound without crashing', () => {
    shallow(
      <Provider store={store}>
        <NotFound location={{ pathname: '' }} />
      </Provider>,
    );
  });
});
