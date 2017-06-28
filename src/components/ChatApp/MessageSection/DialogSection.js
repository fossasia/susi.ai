import Dialog from 'material-ui/Dialog';
import React, { Component } from 'react';
import Login from '../../Auth/Login/Login.react';
import Settings from '../Settings.react';
import PropTypes from 'prop-types';
import HardwareComponent from '../HardwareComponent';

export default class DialogSection extends Component {

  render(){

    return(
      <div>

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
    openSetting: PropTypes.bool,
    openServerChange: PropTypes.bool,
    openHardwareChange: PropTypes.bool,
    openThemeChanger: PropTypes.bool,
    ServerChangeActions: PropTypes.array,
    HardwareActions: PropTypes.array,
    ThemeChangerComponents: PropTypes.array,
    actions: PropTypes.object,
    bodyStyle: PropTypes.object,
    onRequestCloseServerChange: PropTypes.func,
    onRequestCloseHardwareChange: PropTypes.func,
    onRequestClose: PropTypes.func,
    onSettingsSubmit: PropTypes.func,
    onServerChange: PropTypes.func,
    onHardwareSettings: PropTypes.func
};
