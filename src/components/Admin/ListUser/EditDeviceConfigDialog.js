import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import InputField from '@material-ui/core/Input';
import { modifyUserDevices } from '../../../apis/index';
import uiActions from '../../../redux/actions/ui';

class EditDeviceConfig extends React.Component {
  constructor(props) {
    super(props);
    const { room, macid, deviceName } = this.props;
    this.state = {
      room,
      macid,
      deviceName,
    };
  }

  handleSave = () => {
    const { macid, room, deviceName: name } = this.state;
    const { email, actions, handleClose, handleEdit } = this.props;
    console.log(email);
    handleClose();
    modifyUserDevices({ email, macid, room, name })
      .then(payload => {
        handleEdit(name, room, macid);
        actions.openSnackBar({
          snackBarMessage: `Successfully changed the configuration of device with macid: ${macid}`,
          snackBarPosition: { vertical: 'top', horizontal: 'right' },
          variant: 'success',
        });
      })
      .catch(error => {
        console.log(error);
        actions.openSnackBar({
          snackBarMessage: `Unable to change the configuration of device with macid: ${macid}`,
          snackBarPosition: { vertical: 'top', horizontal: 'right' },
          variant: 'error',
        });
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { handleClose } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>
          <span style={{ fontWeight: 'bold', color: 'black' }}> Mac Id:</span>
          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
            {this.state.macid}
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="label">Device Name</div>
          <InputField
            name="deviceName"
            style={{ marginBottom: '10px' }}
            value={this.state.deviceName}
            onChange={this.handleChange}
            placeholder="Enter device name"
          />{' '}
          <div className="label">Room</div>
          <InputField
            name="room"
            value={this.state.room}
            onChange={this.handleChange}
            placeholder="Enter room name"
          />
        </DialogContent>
        <DialogActions>
          <Button key={1} color="primary" onClick={this.handleSave}>
            Save
          </Button>
          <Button key={2} color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

EditDeviceConfig.propTypes = {
  keyName: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  skillName: PropTypes.string,
  skillEditStatus: PropTypes.bool,
  skillReviewStatus: PropTypes.bool,
  skillStaffPickStatus: PropTypes.bool,
  systemSkillStatus: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(EditDeviceConfig);
