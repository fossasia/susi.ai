import React from 'react';
import SignUp from '../../../../components/Auth/SignUp/SignUp.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SignUp />', () => {
  it('render SignUp without crashing', () => {
    shallow(
      <Provider store={store}>
        <SignUp />
      </Provider>,
    );
  });
});
