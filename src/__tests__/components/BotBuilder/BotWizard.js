import React from 'react';
import BotWizard from '../../../components/cms/BotBuilder/BotWizard';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<BotWizard />', () => {
  it('render BotWizard without crashing', () => {
    shallow(
      <Provider store={store}>
        <BotWizard />
      </Provider>,
    );
  });
});
