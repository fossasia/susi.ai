import React from 'react';
import SkillExampleBubble from '../../../components/shared/SkillExampleBubble';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillExampleBubble />', () => {
  it('render SkillExampleBubble without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillExampleBubble />
      </Provider>,
    );
  });
});
