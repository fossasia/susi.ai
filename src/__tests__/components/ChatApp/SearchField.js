import React from 'react';
import SearchField from '../../../components/ChatApp/SearchField.react';
import { shallow } from 'enzyme';

describe('<SearchField />', () => {
  it('render SearchField without crashing', () => {
    shallow(<SearchField />);
  });
});
