import React from 'react';
import SkillRollBack from '../../../components/cms/SkillRollBack/SkillRollBack';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillRollBack />', () => {
  it('render SkillRollBack without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillRollBack
          location={{
            pathname: '/:category/:skill/edit/:lang/:latestid/:revertid',
          }}
        />
      </Provider>,
    );
  });
});
