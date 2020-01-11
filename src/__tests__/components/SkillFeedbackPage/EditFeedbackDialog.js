import React from 'react';
import EditFeedback from '../../../components/cms/SkillFeedbackPage/EditFeedbackDialog';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<EditFeedback />', () => {
  it('render EditFeedback without crashing', () => {
    shallow(
      <Provider store={store}>
        <EditFeedback />
      </Provider>,
    );
  });
});
