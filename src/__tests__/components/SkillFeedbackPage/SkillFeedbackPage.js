import React from 'react';
import SkillFeedbackPage from '../../../components/cms/SkillFeedbackPage/SkillFeedbackPage';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<SkillFeedbackPage />', () => {
  it('render SkillFeedbackPage without crashing', () => {
    shallow(
      <Provider store={store}>
        <SkillFeedbackPage
          location={{ pathname: '/:category/:skill/:lang/feedbacks' }}
        />
      </Provider>,
    );
  });
});
