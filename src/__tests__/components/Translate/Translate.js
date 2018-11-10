import React from 'react';
import ReactDOM from 'react-dom';
import Translate from '../../../components/Translate/Translate.react';

describe('<Translate />', () => {
  it('renders Translate without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Translate />, div);
  });
});
