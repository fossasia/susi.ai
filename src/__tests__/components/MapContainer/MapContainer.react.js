import React from 'react';
import MapContainer from '../../../components/MapContainer/MapContainer.react';
import { shallow } from 'enzyme';

it('render without crashing', () => {
  shallow(<MapContainer />);
});
