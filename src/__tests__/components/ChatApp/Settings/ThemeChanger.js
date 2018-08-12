import React from 'react';
import ThemeChanger from '../../../../components/ChatApp/Settings/ThemeChanger.js';
import { shallow } from 'enzyme';

describe('<ThemeChanger />', () => {
  it('render ThemeChanger without crashing', () => {
    shallow(<ThemeChanger />);
  });
});
