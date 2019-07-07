import React from 'react';
import SkillWizard from '../../../components/cms/SkillCreator/SkillWizard';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillWizard />', () => {
  it('render SkillWizard without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillWizard location={{ pathname: '/:category/:skill/edit/:lang' }} />
      </Provider>,
    );
  });
});
