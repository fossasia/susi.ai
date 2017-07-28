import Dialog from 'material-ui/Dialog';
import React, { Component } from 'react';
import Login from '../../Auth/Login/Login.react';
import SignUp from '../../Auth/SignUp/SignUp.react';
import ChangePassword from '../../Auth/ChangePassword/ChangePassword.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import Settings from '../Settings/Settings.react';
import PropTypes from 'prop-types';
import HardwareComponent from '../HardwareComponent';
import Close from 'material-ui/svg-icons/navigation/close';

export default class DialogSection extends Component {

  render(){
    const closingStyle ={
        position: 'absolute',
        zIndex: 1200,
        fill: '#444',
        width: '26px',
        height: '26px',
        right: '10px',
        top: '10px',
        cursor:'pointer'
      }
    return(
      <div>

        {/* Login */}
        <Dialog
          className='dialogStyle'
          modal={false}
          open={this.props.openLogin}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <Login {...this.props}
          handleForgotPassword={this.props.onForgotPassword()}/>
          <Close style={closingStyle} onTouchTap={this.props.onRequestClose()} />
        </Dialog>

      {/* SignUp */}
      <Dialog
          className='dialogStyle'
          modal={false}
          open={this.props.openSignUp}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <SignUp {...this.props}
            onRequestClose={this.props.onRequestClose()}
            onLoginSignUp={this.props.onLoginSignUp()} />
            <Close style={closingStyle} onTouchTap={this.props.onRequestClose()} />
        </Dialog>

      {/* Change Password */}
      <Dialog
          className='dialogStyle'
          modal={false}
          open={this.props.openChangePassword}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <ChangePassword {...this.props} />
          <Close style={closingStyle} onTouchTap={this.props.onRequestClose()} />
        </Dialog>
      {/*  Forgot Password */}
      <Dialog
          className='dialogStyle'
          modal={false}
          open={this.props.openForgotPassword}
          autoScrollBodyContent={true}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <ForgotPassword {...this.props}
          showForgotPassword={this.showForgotPassword}/>
          <Close style={closingStyle}
          onTouchTap={this.props.onRequestClose()}/>
        </Dialog>

      {/* Settings */}
        <Dialog
          modal={false}
          open={this.props.openSetting}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          onRequestClose={this.props.onRequestClose()}>
          <div>
            <Settings {...this.props}
              onSettingsSubmit={this.props.onSettingsSubmit()}
              onServerChange={this.props.onServerChange()}
              onHardwareSettings={this.props.onHardwareSettings()} />
              <Close style={closingStyle} onTouchTap={this.props.onRequestClose()} />
          </div>
        </Dialog>
      {/* Change Server */}
        <Dialog
          actions={this.props.ServerChangeActions}
          modal={false}
          open={this.props.openServerChange}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          onRequestClose={this.props.onRequestCloseServerChange()}>
          <div>
            <h3>Change Server</h3>
            Please login again to change SUSI server
            <Close style={closingStyle}
            onTouchTap={this.props.onRequestCloseServerChange()} />
          </div>
        </Dialog>
      {/* Hardware Connection */}
        <Dialog
          modal={false}
          open={this.props.openHardwareChange}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          onRequestClose={this.props.onRequestCloseHardwareChange()}>
          <div>
            <HardwareComponent {...this.props} />
            <Close style={closingStyle}
            onTouchTap={this.props.onRequestCloseHardwareChange()} />
          </div>
        </Dialog>
      {/* ThemeChanger */}
        <Dialog
          actions={this.props.customSettingsDone}
          modal={false}
          open={this.props.openThemeChanger}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <div className='settingsComponents'>
            {this.props.ThemeChangerComponents}
          </div>
          <Close style={closingStyle} onTouchTap={this.props.onRequestClose()} />
        </Dialog>
      </div>

    );
  }
}

DialogSection.propTypes = {
    openLogin: PropTypes.bool,
    openSignUp: PropTypes.bool,
    openChangePassword: PropTypes.bool,
    openSetting: PropTypes.bool,
    openServerChange: PropTypes.bool,
    openForgotPassword: PropTypes.bool,
    openHardwareChange: PropTypes.bool,
    openThemeChanger: PropTypes.bool,
    onLoginSignUp:PropTypes.func,
    ServerChangeActions: PropTypes.array,
    HardwareActions: PropTypes.array,
    customSettingsDone: PropTypes.object,
    ThemeChangerComponents: PropTypes.array,
    actions: PropTypes.object,
    bodyStyle: PropTypes.object,
    onRequestCloseServerChange: PropTypes.func,
    onRequestCloseHardwareChange: PropTypes.func,
    onRequestClose: PropTypes.func,
    onSettingsSubmit: PropTypes.func,
    onServerChange: PropTypes.func,
    onHardwareSettings: PropTypes.func,
    onForgotPassword: PropTypes.func,
    onSignedUp: PropTypes.func
};
