import React from 'react';
import EditSkillDialog from '../../../../components/Admin/ListSkills/EditSkillDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<EditSkillDialog />', () => {
  it('render EditSkillDialog without crashing', () => {
    shallow(
      <Provider store={store}>
        <EditSkillDialog />
      </Provider>,
    );
  });
});
