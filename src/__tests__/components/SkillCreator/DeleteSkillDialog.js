import React from 'react';
import DeleteSkillWithInput from '../../../components/cms/SkillCreator/DeleteSkillDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<DeleteSkillWithInput />', () => {
  it('render DeleteSkillWithInput without crashing', () => {
    shallow(
      <Provider store={store}>
        <DeleteSkillWithInput />
      </Provider>,
    );
  });
});
