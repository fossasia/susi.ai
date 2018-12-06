import Dialog from 'material-ui/Dialog';
import React from 'react';
import Login from '../../Auth/Login/Login.react';
import SignUp from '../../Auth/SignUp/SignUp.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import PropTypes from 'prop-types';
import Close from 'material-ui/svg-icons/navigation/close';

const DialogSection = props => {
  const closingStyle = {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  };
  return (
    <div>
      {/* Login */}
      <Dialog
        className="dialogStyle"
        modal={false}
        open={props.openLogin}
        autoScrollBodyContent={true}
        bodyStyle={props.bodyStyle}
        contentStyle={{ width: '35%', minWidth: '300px' }}
        onRequestClose={props.onRequestClose()}
      >
        <Login
          {...props}
          handleForgotPassword={props.onForgotPassword()}
          handleSignUp={props.handleSignUp}
        />
        <Close style={closingStyle} onTouchTap={props.onRequestClose()} />
      </Dialog>
      {/* SignUp */}
      <Dialog
        className="dialogStyle"
        modal={false}
        open={props.openSignUp}
        autoScrollBodyContent={true}
        bodyStyle={props.bodyStyle}
        contentStyle={{ width: '35%', minWidth: '300px' }}
        onRequestClose={props.onRequestClose()}
      >
        <SignUp
          {...props}
          onRequestClose={props.onRequestClose()}
          onLoginSignUp={props.onLoginSignUp()}
        />
        <Close style={closingStyle} onTouchTap={props.onRequestClose()} />
      </Dialog>
      {/*  Forgot Password */}
      <Dialog
        className="dialogStyle"
        modal={false}
        open={props.openForgotPassword}
        autoScrollBodyContent={true}
        contentStyle={{ width: '35%', minWidth: '300px' }}
        onRequestClose={props.onRequestClose()}
      >
        <ForgotPassword {...props} onLoginSignUp={props.onLoginSignUp()} />
        <Close style={closingStyle} onTouchTap={props.onRequestClose()} />
      </Dialog>
      <Dialog
        className="dialogStyle"
        contentStyle={{
          width: '45%',
          minWidth: '300px',
          textAlign: 'center',
        }}
        title="Welcome to SUSI.AI Web Chat"
        open={props.tour}
      >
        <iframe
          width="99%"
          height="315"
          src="https://www.youtube.com/embed/9T3iMoAUKYA"
          frameBorder="0"
          scrolling="no"
        />
        <Close style={closingStyle} onTouchTap={props.onRequestCloseTour()} />
      </Dialog>
    </div>
  );
};

DialogSection.propTypes = {
  openLogin: PropTypes.bool,
  openSignUp: PropTypes.bool,
  openForgotPassword: PropTypes.bool,
  openHardwareChange: PropTypes.bool,
  tour: PropTypes.bool,
  onLoginSignUp: PropTypes.func,
  handleSignUp: PropTypes.func,
  ServerChangeActions: PropTypes.array,
  HardwareActions: PropTypes.array,
  bodyStyle: PropTypes.object,
  onRequestClose: PropTypes.func,
  onRequestCloseTour: PropTypes.func,
  onSaveThemeSettings: PropTypes.func,
  onForgotPassword: PropTypes.func,
  onSignedUp: PropTypes.func,
};

export default DialogSection;
