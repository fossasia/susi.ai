import React from 'react';
import DevicesTab from '../../../../components/Settings/DevicesTab';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<DevicesTab />', () => {
  it('render DevicesTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <DevicesTab />
      </Provider>,
    );
  });
});
