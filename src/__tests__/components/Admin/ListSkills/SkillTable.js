import React from 'react';
import SkillTable from '../../../../components/Admin/ListSkills/SkillTable';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillTable />', () => {
  it('render SkillTable without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillTable />
      </Provider>,
    );
  });
});
