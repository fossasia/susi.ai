import React from 'react';
import Translate from '../../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import { FlexContainer } from '../../Commons/Container';

const ChatAppTab = props => {
  return (
    <SettingsTabWrapper heading="Preferences" theme={props.themeVal}>
      <FlexContainer>
        <div className="reduceSettingDiv">
          <Translate text="Send message by pressing ENTER" />
        </div>
        <div>
          <Switch
            color="primary"
            className="settings-toggle"
            onChange={props.handleEnterAsSend}
            checked={props.enterAsSend}
          />
        </div>
      </FlexContainer>
    </SettingsTabWrapper>
  );
};

ChatAppTab.propTypes = {
  enterAsSend: PropTypes.bool,
  themeVal: PropTypes.string,
  handleEnterAsSend: PropTypes.func,
};

export default ChatAppTab;
