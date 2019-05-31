import React from 'react';
import Translate from '../../../components/Translate/Translate.react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Translate />', () => {
  it('render Translate without crashing', () => {
    shallow(
      <Provider store={store}>
        <Translate />
      </Provider>,
    );
  });
});
