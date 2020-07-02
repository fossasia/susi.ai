import React from 'react';
import Dropzone from '../../../../../components/Admin/Settings/Slideshow/Dropzone';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Dropzone />', () => {
  it('render Dropzone without crashing', () => {
    shallow(
      <Provider store={store}>
        <Dropzone />
      </Provider>,
    );
  });
});
