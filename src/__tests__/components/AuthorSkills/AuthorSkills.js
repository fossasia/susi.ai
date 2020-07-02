import React from 'react';
import AuthorSkills from '../../../components/cms/AuthorSkills/AuthorSkills';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<AuthorSkills />', () => {
  it('render AuthorSkills without crashing', () => {
    shallow(
      <Provider store={store}>
        <AuthorSkills open={false} author="" author_url="" />
      </Provider>,
    );
  });
});
