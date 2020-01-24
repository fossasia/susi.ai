import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../../shared/Button';
import OutlinedTextField from '../../../shared/OutlinedTextField';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../../redux/actions/ui';
import { modifyUserDevices } from '../../../../apis';

class EditDeviceSettings extends React.Component {
  state = {
    deviceName: this.props.deviceName,
    room: this.props.room,
    loading: false,
  };

  handleClose = () => {
    this.props.actions.closeModal();
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleConfirm = async () => {
    const { room } = this.state;
    const { email, actions, macid } = this.props;
    this.setState({ showEditDeviceDialog: false });
    try {
      // eslint-disable-next-line no-unused-vars
      let payload = await modifyUserDevices({ email, macid, room });
      actions.openModal({
        modalType: 'confirm',
        content: (
          <div>
            Successfully changed the configuration of device with macid
            <span style={{ fontWeight: 'bold', margin: '0 5px' }}>{macid}</span>
            !
          </div>
        ),
        title: 'Success',
        handleConfirm: this.props.actions.closeModal,
      });
    } catch (error) {
      console.log(error);

      actions.openModal({
        modalType: 'confirm',
        content: (
          <div>
            Unable to change the configuration of device with macid
            <span style={{ fontWeight: 'bold', margin: '0 5px' }}>{macid}</span>
            !
          </div>
        ),
        title: 'Failure',
        handleConfirm: this.props.actions.closeModal,
      });

      this.setState({ editDeviceFailedDialog: true });
    }
  };

  render() {
    const { macid } = this.props;
    const { deviceName, room, loading } = this.state;

    return (
      <React.Fragment>
        <DialogTitle>Edit device config</DialogTitle>
        <DialogContent>
          <h3 style={{ float: 'left' }}>Mac Id: {macid}</h3>
          <OutlinedTextField
            name="deviceName"
            style={{ marginBottom: '10px' }}
            value={deviceName}
            onChange={this.handleChange}
            placeholder="Enter device name"
            label="Device name"
            fullWidth={true}
            margin="dense"
          />
          <OutlinedTextField
            name="room"
            value={room}
            onChange={this.handleChange}
            placeholder="Enter room name"
            label="Room name"
            fullWidth={true}
            margin="dense"
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button
            key={1}
            variant="contained"
            color="primary"
            handleClick={() => {
              this.setState({ loading: true });
              this.handleConfirm();
            }}
            isLoading={loading}
            disabled={loading}
            buttonText="Save"
          />
          <Button
            key={2}
            variant="contained"
            color="primary"
            handleClick={this.handleClose}
            buttonText="Cancel"
          />
        </DialogActions>
      </React.Fragment>
    );
  }
}

EditDeviceSettings.propTypes = {
  data: PropTypes.array,
  email: PropTypes.string,
  macid: PropTypes.string,
  deviceName: PropTypes.string,
  room: PropTypes.string,
  handleClose: PropTypes.func,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(EditDeviceSettings);
