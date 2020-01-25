import React from 'react';
import DialogSection from '../../../components/shared/Dialog/index';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<DialogSection />', () => {
  it('renders DialogSection without crashing', () => {
    shallow(
      <Provider store={store}>
        <DialogSection />
      </Provider>,
    );
  });
});
