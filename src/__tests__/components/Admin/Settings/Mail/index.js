import React from 'react';
import Mail from '../../../../../components/Admin/Settings/Mail';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Mail />', () => {
  it('render Mail without crashing', () => {
    shallow(
      <Provider store={store}>
        <Mail />
      </Provider>,
    );
  });
});
