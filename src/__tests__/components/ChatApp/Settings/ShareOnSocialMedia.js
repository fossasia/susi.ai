import React from 'react';
import ShareOnSocialMedia from '../../../../components/ChatApp/Settings/ShareOnSocialMedia.js';
import { shallow } from 'enzyme';

describe('<ShareOnSocialMedia />', () => {
  it('render ShareOnSocialMedia without crashing', () => {
    shallow(<ShareOnSocialMedia />);
  });
});
