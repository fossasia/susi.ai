import React from 'react';
import MapContainer from '../../../components/cms/MyDevices/MapContainer';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
const mockStore = configureMockStore();
const store = mockStore({});

describe('<MapContainer />', () => {
  it('renders MapContainer without crashing', () => {
    shallow(
      <Provider store={store}>
        <MapContainer />
      </Provider>,
    );
  });
});
