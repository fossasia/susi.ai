import React from 'react';
import MySkills from '../../../components/cms/Dashboard/MySkills';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MySkills />', () => {
  it('render MySkills without crashing', () => {
    shallow(
      <Provider store={store}>
        <MySkills />
      </Provider>,
    );
  });
});
