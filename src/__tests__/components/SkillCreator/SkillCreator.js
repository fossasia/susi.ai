import React from 'react';
import SkillCreator from '../../../components/cms/SkillCreator/SkillCreator';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillCreator />', () => {
  it('render SkillCreator without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillCreator
          location={{ pathname: '/skills/:category/:skill/edit/:lang' }}
        />
      </Provider>,
    );
  });
});
