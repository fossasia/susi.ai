import React from 'react';
import DevicesTab from '../../../../components/ChatApp/Settings/DevicesTab.react';
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
