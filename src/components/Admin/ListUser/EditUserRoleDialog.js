import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import _Select from '@material-ui/core/Select';
import { changeUserRole } from '../../../apis';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import styled from 'styled-components';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const Select = styled(_Select)``;

class EditUserRole extends React.Component {
  state = {
    userEmail: this.props.userEmail,
    userRole: this.props.userRole,
  };
  handleUserRoleChange = event => {
    this.setState({ userRole: event.target.value });
  };

  handleConfirm = () => {
    const { userEmail: user, userRole: role } = this.state;
    const { actions } = this.props;
    changeUserRole({ user, role }).then(payload => {
      this.setState({ changeRoleDialog: true });
      actions
        .openModal({
          modalType: 'confirm',
          content: (
            <React.Fragment>
              User role of
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.userEmail}
              </span>
              is changed to
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.userRole}
              </span>
              successfully!
            </React.Fragment>
          ),
          title: 'Success',
          handleConfirm: this.props.actions.closeModal,
        })
        .catch(error => {
          const { statusCode } = error;
          if (statusCode === 401) {
            if (window.console) {
              console.log(error.responseText);
              console.log('Error 401: Permission Denied!');
            }
          } else if (statusCode === 503) {
            if (window.console) {
              console.log(error.responseText);
            }
            console.log('Error 503: Server not responding!');
            document.location.reload();
          } else {
            console.log(error);
          }
        });
    });
  };

  render() {
    const { userEmail, handleClose } = this.props;
    const { userRole } = this.state;
    return (
      <React.Fragment>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <h3>
            Select new User Role for
            <b style={{ marginLeft: '5px' }}>{userEmail}</b>
          </h3>
          <Select
            input={<OutlinedInput margin="dense" />}
            onChange={this.handleUserRoleChange}
            value={userRole}
          >
            <MenuItem key="user" value="user">
              User
            </MenuItem>
            <MenuItem key="reviewer" value="reviewer">
              Reviewer
            </MenuItem>
            <MenuItem key="operator" value="operator">
              Operator
            </MenuItem>
            <MenuItem key="admin" value="admin">
              Admin
            </MenuItem>
            <MenuItem key="superadmin" value="superadmin">
              Super Admin
            </MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button key={1} onClick={this.handleConfirm}>
            Change
          </Button>
          <Button key={2} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

EditUserRole.propTypes = {
  userEmail: PropTypes.string,
  handleClose: PropTypes.func,
  userRole: PropTypes.string,
  handleChangeUserRole: PropTypes.func,
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
)(EditUserRole);
