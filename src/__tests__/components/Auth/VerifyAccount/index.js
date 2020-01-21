import React from 'react';
import VerifyAccount from '../../../../components/Auth/VerifyAccount/VerifyAccount';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<VerifyAccount />', () => {
  it('renders VerifyAccount without crashing', () => {
    shallow(
      <Provider store={store}>
        <VerifyAccount />
      </Provider>,
    );
  });
});
