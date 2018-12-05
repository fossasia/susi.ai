import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/RaisedButton';
import React from 'react';
import Login from '../../Auth/Login/Login.react';
import SignUp from '../../Auth/SignUp/SignUp.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import PropTypes from 'prop-types';
import Close from 'material-ui/svg-icons/navigation/close';
import Lottie from 'react-lottie';
import * as susianim from '../../../anim/susi.json';
import Divider from 'material-ui/Divider';
// https://www.youtube.com/watch?v=9T3iMoAUKYA
const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: susianim,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};
const style = {
  margin: 12,
};
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
          width: '50%',
          minWidth: '300px',
          textAlign: 'center',
        }}
        title="Welcome to SUSI.AI Web Chat"
        open={props.tour}
      >
        <Lottie options={defaultOptions} />
        <Divider />
        <a href="https://www.youtube.com/watch?v=9T3iMoAUKYA" target="_blank">
          <Button
            label="Learn More with Youtube"
            secondary={true}
            style={style}
            onTouchTap={props.onRequestCloseTour()}
          />
        </a>
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
