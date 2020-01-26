import React from 'react';
import RecaptchaOptions from '../../../../components/Admin/Messages/RecaptchaOptions.js';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<RecaptchaOptions />', () => {
  it('render RecaptchaOptions without crashing', () => {
    shallow(
      <Provider store={store}>
        <RecaptchaOptions />
      </Provider>,
    );
  });
});
