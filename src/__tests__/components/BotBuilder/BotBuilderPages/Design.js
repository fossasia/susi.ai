import React from 'react';
import Design from '../../../../components/cms/BotBuilder/BotBuilderPages/Design';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Design />', () => {
  it('render Design without crashing', () => {
    shallow(
      <Provider store={store}>
        <Design />
      </Provider>,
    );
  });
});
