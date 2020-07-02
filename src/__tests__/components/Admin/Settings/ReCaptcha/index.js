import React from 'react';
import ReCaptcha from '../../../../../components/Admin/Settings/ReCaptcha';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ReCaptcha />', () => {
  it('render ReCaptcha without crashing', () => {
    shallow(
      <Provider store={store}>
        <ReCaptcha />
      </Provider>,
    );
  });
});
