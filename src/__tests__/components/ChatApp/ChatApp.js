import React from 'react';
import ReactDOM from 'react-dom';
import ChatApp from '../../../components/ChatApp/ChatApp.react';

describe('<ChatApp />', () => {
  it('renders ChatApp without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ChatApp />, div);
  });
});
