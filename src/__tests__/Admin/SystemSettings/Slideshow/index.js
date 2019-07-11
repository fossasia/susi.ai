import React from 'react';
import Slideshow from '../../../../components/Admin/SystemSettings/Slideshow';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Slideshow />', () => {
  it('render Slideshow without crashing', () => {
    shallow(
      <Provider store={store}>
        <Slideshow />
      </Provider>,
    );
  });
});
