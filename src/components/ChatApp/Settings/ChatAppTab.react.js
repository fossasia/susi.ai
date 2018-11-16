import React from 'react';
import Translate from '../../Translate/Translate.react';
import Toggle from 'material-ui/Toggle';
import PropTypes from 'prop-types';

const ChatAppTab = props => {
  return (
    <div style={props.containerStyle}>
      <div
        style={{
          marginTop: '10px',
          marginBottom: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        <Translate text="Preferences" />
      </div>
      {props.themeVal === 'light' ? (
        <hr className="break-line-light" style={{ height: '2px' }} />
      ) : (
        <hr className="break-line-dark" />
      )}
      <br />
      <div
        style={{
          float: 'left',
          padding: '0px 5px 0px 0px',
        }}
        className="reduceSettingDiv"
      >
        <Translate text="Send message by pressing ENTER" />
      </div>
      <Toggle
        className="settings-toggle"
        onToggle={props.handleEnterAsSend}
        labelStyle={{ color: props.themeForegroundColor }}
        toggled={props.enterAsSend}
      />
      <br />
    </div>
  );
};

ChatAppTab.propTypes = {
  containerStyle: PropTypes.object,
  enterAsSend: PropTypes.bool,
  themeForegroundColor: PropTypes.string,
  themeVal: PropTypes.string,
  handleEnterAsSend: PropTypes.func,
};

export default ChatAppTab;
