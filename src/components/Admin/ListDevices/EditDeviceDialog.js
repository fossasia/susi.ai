import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import _OutlinedTextField from '../../shared/OutlinedTextField';
import styled from 'styled-components';

const OutlinedTextField = styled(_OutlinedTextField)`
  width: 100%;
`;

export default class EditDeviceDialog extends Component {
  static propTypes = {
    email: PropTypes.string,
    macId: PropTypes.string,
    room: PropTypes.string,
    deviceName: PropTypes.string,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { room, deviceName } = this.props;
    this.state = {
      room,
      deviceName,
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { macId, email, handleConfirm, handleClose } = this.props;
    const { room, deviceName } = this.state;
    return (
      <React.Fragment>
        <DialogTitle>Edit Device Details for {macId}</DialogTitle>
        <DialogContent>
          <OutlinedTextField
            value={deviceName}
            label="Device Name"
            name="deviceName"
            variant="outlined"
            onChange={this.handleChange}
            style={{ marginRight: '20px' }}
          />
          <OutlinedTextField
            value={room}
            label="Room"
            name="room"
            variant="outlined"
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            key={1}
            color="primary"
            onClick={() => handleConfirm(email, macId, room, deviceName)}
          >
            Change
          </Button>
          <Button key={2} color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}
