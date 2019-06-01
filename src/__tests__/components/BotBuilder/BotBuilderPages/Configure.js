import React from 'react';
import Configure from '../../../../components/cms/BotBuilder/BotBuilderPages/Configure';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Configure />', () => {
  it('render Configure without crashing', () => {
    shallow(
      <Provider store={store}>
        <Configure />
      </Provider>,
    );
  });
});
