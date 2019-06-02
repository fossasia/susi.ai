import React from 'react';
import SystemSettings from '../../../components/Admin/SystemSettings/SystemSettings';
import { shallow } from 'enzyme';

describe('<SystemSettings />', () => {
  it('render SystemSettings without crashing', () => {
    shallow(<SystemSettings />);
  });
});
