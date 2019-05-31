import React from 'react';
import PasswordTab from '../../../../components/ChatApp/Settings/PasswordTab.react';
import { shallow } from 'enzyme';

describe('<PasswordTab />', () => {
  it('render PasswordTab without crashing', () => {
    shallow(<PasswordTab />);
  });
});
