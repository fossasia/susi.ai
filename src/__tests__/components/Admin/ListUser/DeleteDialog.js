import React from 'react';
import DeleteAccount from '../../../../components/Admin/ListUser/DeleteDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
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
