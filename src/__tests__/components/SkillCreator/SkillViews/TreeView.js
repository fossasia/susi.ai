import React from 'react';
import TreeView from '../../../../components/cms/SkillCreator/SkillViews/TreeView';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<TreeView />', () => {
  it('render TreeView without crashing', () => {
    shallow(
      <Provider store={store}>
        <TreeView />
      </Provider>,
    );
  });
});
