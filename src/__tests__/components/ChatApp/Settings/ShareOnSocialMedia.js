import React from 'react';
import ShareOnSocialMedia from '../../../../components/ChatApp/Settings/ShareOnSocialMedia.js';
import { shallow } from 'enzyme';

it('render ShareOnSocialMedia without crashing', () => {
  shallow(<ShareOnSocialMedia />);
});
