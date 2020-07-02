import React from 'react';
import ReportPanel from '../../../../components/Admin/ListSkills/ReportPanel';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<ReportPanel />', () => {
  it('render ReportPanel without crashing', () => {
    shallow(
      <Provider store={store}>
        <ReportPanel />
      </Provider>,
    );
  });
});
