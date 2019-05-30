import React from 'react';
import SkillListing from '../../../components/cms/SkillPage/SkillListing';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillListing />', () => {
  it('render SkillListing without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillListing />
      </Provider>,
    );
  });
});
