import React from 'react';
import ThemeChanger from '../../../components/Settings/ThemeChanger';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ThemeChanger />', () => {
  it('render ThemeChanger without crashing', () => {
    shallow(
      <Provider store={store}>
        <ThemeChanger />
      </Provider>,
    );
  });
});
