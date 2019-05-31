import React from 'react';
import BotBuilderWrap from '../../../components/cms/BotBuilder/BotBuilderWrap';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<BotBuilderWrap />', () => {
  it('render BotBuilderWrap without crashing', () => {
    shallow(
      <Provider store={store}>
        <BotBuilderWrap />
      </Provider>,
    );
  });
});
