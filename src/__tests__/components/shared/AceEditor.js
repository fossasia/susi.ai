import React from 'react';
import AceEditorComponent from '../../../components/shared/AceEditor';
import { shallow } from 'enzyme';

describe('<AceEditorComponent />', () => {
  it('render AceEditorComponent without crashing', () => {
    shallow(<AceEditorComponent />);
  });
});
