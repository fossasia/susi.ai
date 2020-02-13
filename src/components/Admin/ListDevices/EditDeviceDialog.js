import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../shared/Button';
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

  state = {
    room: this.props.room,
    deviceName: this.props.deviceName,
    loading: false,
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { macId, email, handleConfirm, handleClose } = this.props;
    const { room, deviceName, loading } = this.state;
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
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button
            key={1}
            variant="contained"
            color="primary"
            handleClick={() => {
              this.setState({ loading: true });
              handleConfirm(email, macId, room, deviceName);
            }}
            isLoading={loading}
            disabled={loading}
            buttonText="Change"
          />
          <Button
            key={2}
            variant="contained"
            color="primary"
            handleClick={handleClose}
            buttonText="Cancel"
          />
        </DialogActions>
      </React.Fragment>
    );
  }
}
