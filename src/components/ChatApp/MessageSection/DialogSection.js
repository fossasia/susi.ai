import Dialog from 'material-ui/Dialog';
import React, { Component } from 'react';
import Login from '../../Auth/Login/Login.react';
import SignUp from '../../Auth/SignUp/SignUp.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import Settings from '../Settings.react';
import PropTypes from 'prop-types';
import HardwareComponent from '../HardwareComponent';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import RaisedButton from 'material-ui/RaisedButton';

export default class DialogSection extends Component {

  showForgotPassword = (toShow) => {
    this.props.onForgotPassword(toShow);
  }

  render(){

    const ForgotPwdAction = <RaisedButton
      label="Cancel"
      backgroundColor={
        UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.showForgotPassword.bind(this,false)}
    />;

    return(
      <div>

        {/* Login */}
        <Dialog
          className='dialogStyle'
          actions={this.props.actions}
          modal={false}
          open={this.props.openLogin}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <Login {...this.props} />
        </Dialog>

      {/* Forgot Password */}
        <Dialog
          className='dialogStyle'
          actions={ForgotPwdAction}
          modal={false}
          open={this.props.openForgotPassword}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.showForgotPassword.bind(this,false)}>
          <ForgotPassword {...this.props}
            showForgotPassword={this.showForgotPassword} />
        </Dialog>

      {/* SignUp */}
      <Dialog
          className='dialogStyle'
          actions={this.props.actions}
          modal={false}
          open={this.props.openSignUp}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <SignUp
          {...this.props}
          />
        </Dialog>

      {/* Settings */}
        <Dialog
          actions={this.props.actions}
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
          </div>
        </Dialog>
      {/* Hardware Connection */}
        <Dialog
          HardwareActions={this.props.HardwareActions}
          modal={false}
          open={this.props.openHardwareChange}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          onRequestClose={this.props.onRequestCloseHardwareChange()}>
          <div>
            <HardwareComponent {...this.props} />
          </div>
        </Dialog>
      {/* ThemeChanger */}
        <Dialog
          actions={this.props.actions}
          modal={false}
          open={this.props.openThemeChanger}
          autoScrollBodyContent={true}
          bodyStyle={this.props.bodyStyle}
          contentStyle={{width: '35%',minWidth: '300px'}}
          onRequestClose={this.props.onRequestClose()}>
          <div className='settingsComponents'>
            {this.props.ThemeChangerComponents}
          </div>
        </Dialog>
      </div>

    );
  }
}

DialogSection.propTypes = {
    openLogin: PropTypes.bool,
    openForgotPassword: PropTypes.bool,
    openSignUp: PropTypes.bool,
    openSetting: PropTypes.bool,
    openServerChange: PropTypes.bool,
    openHardwareChange: PropTypes.bool,
    openThemeChanger: PropTypes.bool,
    ServerChangeActions: PropTypes.array,
    HardwareActions: PropTypes.array,
    ThemeChangerComponents: PropTypes.array,
    actions: PropTypes.object,
    bodyStyle: PropTypes.object,
    onForgotPassword: PropTypes.func,
    onRequestCloseServerChange: PropTypes.func,
    onRequestCloseHardwareChange: PropTypes.func,
    onRequestClose: PropTypes.func,
    onSettingsSubmit: PropTypes.func,
    onServerChange: PropTypes.func,
    onHardwareSettings: PropTypes.func,
    onSignedUp: PropTypes.func
};
