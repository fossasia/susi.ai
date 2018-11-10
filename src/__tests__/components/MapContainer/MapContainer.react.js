import React from 'react';
import MapContainer from '../../../components/MapContainer/MapContainer.react';
import { shallow } from 'enzyme';

describe('<MapContainer />', () => {
  it('renders MapContainer without crashing', () => {
    shallow(<MapContainer />);
  });
});
