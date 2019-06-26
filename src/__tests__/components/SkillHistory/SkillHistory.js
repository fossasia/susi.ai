import React from 'react';
import SkillHistory from '../../../components/cms/SkillHistory/SkillHistory';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillHistory />', () => {
  it('render SkillHistory without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillHistory
          location={{
            pathname: '/skills/:category/:skill/compare/:lang/:oldid/:recentid',
          }}
        />
      </Provider>,
    );
  });
});
