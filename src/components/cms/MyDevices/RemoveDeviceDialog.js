import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Translate from '../../Translate/Translate.react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const WarningContainer = styled.div`
  background-color: #fffbdd;
  color: #735c0f;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(27, 31, 35, 0.15);
`;

const DangerButton = styled(Button)`
  color: #cb2431;
  border-color: #cb2431;
`;

class RemoveDeviceDialog extends Component {
  static propTypes = {
    removeDeviceName: PropTypes.string,
    removeDeviceIndex: PropTypes.number,
    onDeviceRemove: PropTypes.func,
    onCancel: PropTypes.func,
    deviceWizard: PropTypes.bool,
  };

  state = {
    deviceName: '',
  };

  // Handle changes in device name
  handleChange = event => {
    this.setState({
      deviceName: event.target.value,
    });
  };

  render() {
    const {
      onDeviceRemove,
      onCancel,
      removeDeviceName,
      removeDeviceIndex,
      deviceWizard = false,
    } = this.props;
    const { deviceName } = this.state;
    const shouldDisable = !(deviceName === removeDeviceName);
    return (
      <div>
        <DialogTitle id="form-dialog-title">
          Are you absolutely sure?
        </DialogTitle>
        <DialogContent>
          <WarningContainer>
            Unexpected bad things will happen if you don&apos;t read this!
          </WarningContainer>
          <DialogContentText>
            This action <strong>cannot</strong> be undone. This will permanently
            remove the device corresponding to the device name{' '}
            <strong>{removeDeviceName}</strong>.
            <br />
            <br />
            <strong>Please type in the name of the device to confirm.</strong>
          </DialogContentText>
          <OutlinedInput
            value={deviceName}
            autoFocus
            onChange={this.handleChange}
            margin="dense"
            label="Device Name"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <DangerButton
            variant="outlined"
            disabled={shouldDisable}
            onClick={() =>
              deviceWizard
                ? onDeviceRemove()
                : onDeviceRemove(removeDeviceIndex)
            }
          >
            <Translate text="I understand, remove device" />
          </DangerButton>
        </DialogActions>
      </div>
    );
  }
}

export default RemoveDeviceDialog;
