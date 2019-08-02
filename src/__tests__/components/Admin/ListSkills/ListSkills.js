import React from 'react';
import ListSkills from '../../../components/Admin/ListSkills/ListSkills';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ListSkills />', () => {
  it('render ListSkills without crashing', () => {
    shallow(
      <Provider store={store}>
        <ListSkills />
      </Provider>,
    );
  });
});
