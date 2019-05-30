import React from 'react';
import SkillRatingCard from '../../../components/cms/SkillRating/SkillRatingCard';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillRatingCard />', () => {
  it('render SkillRatingCard without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillRatingCard />
      </Provider>,
    );
  });
});
