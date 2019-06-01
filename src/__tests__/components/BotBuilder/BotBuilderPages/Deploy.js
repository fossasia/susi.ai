import React from 'react';
import Deploy from '../../../../components/cms/BotBuilder/BotBuilderPages/Deploy';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Deploy />', () => {
  it('render Deploy without crashing', () => {
    shallow(
      <Provider store={store}>
        <Deploy />
      </Provider>,
    );
  });
});
