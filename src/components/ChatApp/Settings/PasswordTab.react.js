import React from 'react';
import Translate from '../../Translate/Translate.react';
import ChangePassword from '../../Auth/ChangePassword/ChangePassword.react';
import PropTypes from 'prop-types';

const PasswordTab = props => {
  return (
    <div style={props.containerStyle}>
      <span>
        <span>
          <div
            style={{
              marginTop: '10px',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            <Translate text="Password" />
          </div>
        </span>
        {props.themeVal === 'light' ? (
          <hr
            className="break-line-light"
            style={{ height: '2px', marginBottom: '10px' }}
          />
        ) : (
          <hr
            className="break-line-dark"
            style={{ height: '2px', marginBottom: '10px' }}
          />
        )}
        <ChangePassword settings={props.intialSettings} {...props} />
      </span>
    </div>
  );
};

PasswordTab.propTypes = {
  containerStyle: PropTypes.object,
  intialSettings: PropTypes.object,
  themeVal: PropTypes.string,
};

export default PasswordTab;
