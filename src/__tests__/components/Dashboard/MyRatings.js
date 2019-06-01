import React from 'react';
import MyRatings from '../../../components/cms/Dashboard/MyRatings';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MyRatings />', () => {
  it('render MyRatings without crashing', () => {
    shallow(
      <Provider store={store}>
        <MyRatings />
      </Provider>,
    );
  });
});
