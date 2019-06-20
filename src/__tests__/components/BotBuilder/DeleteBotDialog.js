import React from 'react';
import DeleteDialog from '../../../components/cms/BotBuilder/DeleteBotDialog';
import { shallow } from 'enzyme';

describe('<DeleteDialog />', () => {
  it('render DeleteDialog without crashing', () => {
    shallow(<DeleteDialog />);
  });
});
