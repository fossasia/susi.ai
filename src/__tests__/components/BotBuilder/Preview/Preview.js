import React from 'react';
import Preview from '../../../../components/cms/BotBuilder/Preview/Preview';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Preview />', () => {
  it('render Preview without crashing', () => {
    shallow(
      <Provider store={store}>
        <Preview />
      </Provider>,
    );
  });
});
