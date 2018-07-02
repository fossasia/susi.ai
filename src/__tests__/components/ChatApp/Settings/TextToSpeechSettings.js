import React from 'react';
import TextToSpeechSettings from '../../../../components/ChatApp/Settings/TextToSpeechSettings.react';
import { shallow } from 'enzyme';

it('render TextToSpeechSettings without crashing', () => {
  shallow(<TextToSpeechSettings />);
});
