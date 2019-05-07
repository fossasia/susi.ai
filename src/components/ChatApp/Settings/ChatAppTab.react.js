import React from 'react';
import Translate from '../../Translate/Translate.react';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import { FlexContainer } from '../../Commons/Container';

const ChatAppTab = props => {
  return (
    <div style={props.containerStyle}>
      <div style={props.tabHeadingStyle}>
        <Translate text="Preferences" />
      </div>
      {props.themeVal === 'light' ? (
        <hr className="break-line-light" style={{ height: '2px' }} />
      ) : (
        <hr className="break-line-dark" />
      )}
      <br />
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
    </div>
  );
};

ChatAppTab.propTypes = {
  tabHeadingStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  enterAsSend: PropTypes.bool,
  themeVal: PropTypes.string,
  handleEnterAsSend: PropTypes.func,
};

export default ChatAppTab;
