import React from 'react';
import SkillVersion from '../../../components/cms/SkillVersion/SkillVersion';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillVersion />', () => {
  it('render SkillVersion without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillVersion
          location={{ pathname: '/:category/:skill/versions/:lang' }}
        />
      </Provider>,
    );
  });
});
