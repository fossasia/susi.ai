import React from 'react';
import DeleteAccountModal from '../../../components/Auth/DeleteAccount/DeleteAccountModal';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<DeleteAccountModal />', () => {
  it('render DeleteAccountModal without crashing', () => {
    shallow(
      <Provider store={store}>
        <DeleteAccountModal />
      </Provider>,
    );
  });
});
