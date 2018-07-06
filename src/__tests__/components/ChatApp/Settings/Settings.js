import React from 'react';
import Settings from '../../../../components/ChatApp/Settings/Settings.react';
import { shallow } from 'enzyme';

describe('<Settings />', () => {
  it('render Settings without crashing', () => {
    shallow(<Settings />);
  });
});
