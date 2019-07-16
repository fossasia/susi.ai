import React from 'react';
import MapContainer from '../../../components/cms/MyDevices/MapContainer';
import { shallow } from 'enzyme';

describe('<MapContainer />', () => {
  it('renders MapContainer without crashing', () => {
    shallow(<MapContainer />);
  });
});
