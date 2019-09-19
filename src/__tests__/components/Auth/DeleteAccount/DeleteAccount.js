import React from 'react';
import DeleteAccount from '../../../components/Auth/DeleteAccount/DeleteAccount';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<DeleteAccount />', () => {
  it('render DeleteAccount without crashing', () => {
    shallow(
      <Provider store={store}>
        <DeleteAccount />
      </Provider>,
    );
  });
});
