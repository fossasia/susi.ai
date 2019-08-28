import React from 'react';
import Terms from '../../../../components/About/Terms';
import { shallow } from 'enzyme';

describe('<Terms />', () => {
  it('render Terms without crashing', () => {
    shallow(<Terms location={{ pathname: '/terms' }} />);
  });
});
