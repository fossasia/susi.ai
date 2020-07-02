import React from 'react';
import SearchBar from '../../../components/NavigationBar/SearchBar';
import { shallow } from 'enzyme';

describe('<SearchBar />', () => {
  it('renders SearchBar without crashing', () => {
    shallow(<SearchBar />);
  });
});
