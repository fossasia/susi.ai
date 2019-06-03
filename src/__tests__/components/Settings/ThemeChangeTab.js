import React from 'react';
import ThemeChangeTab from '../../../components/Settings/ThemeChangeTab.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ThemeChangeTab />', () => {
  it('render ThemeChangeTab without crashing', () => {
    shallow(
      <Provider store={store}>
        <ThemeChangeTab />
      </Provider>,
    );
  });
});
