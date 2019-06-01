import React from 'react';
import UIView from '../../../../../components/cms/BotBuilder/BotBuilderPages/DesignViews/UIView';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<UIView />', () => {
  it('render UIView without crashing', () => {
    shallow(
      <Provider store={store}>
        <UIView />
      </Provider>,
    );
  });
});
