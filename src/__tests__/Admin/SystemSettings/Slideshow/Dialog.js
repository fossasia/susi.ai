import React from 'react';
import SkillSlideshowDialog from '../../../../components/Admin/SystemSettings/Slideshow/Dialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillSlideshowDialog />', () => {
  it('render SkillSlideshowDialog without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillSlideshowDialog />
      </Provider>,
    );
  });
});
