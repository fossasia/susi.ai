import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../shared/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '../../shared/Select';
import { changeUserRole } from '../../../apis';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import OutlinedInput from '@material-ui/core/OutlinedInput';

class EditUserRole extends React.Component {
  state = {
    userEmail: this.props.userEmail,
    userRole: this.props.userRole,
    loading: false,
  };
  handleUserRoleChange = event => {
    this.setState({ userRole: event.target.value });
  };

  handleConfirm = async () => {
    const { userEmail: user, userRole: role } = this.state;
    const { actions } = this.props;
    try {
      await changeUserRole({ user, role });
    } catch (error) {
      console.log(error);
    }
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
  };

  render() {
    const { userEmail, handleClose } = this.props;
    const { userRole, loading } = this.state;
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
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button
            variant="contained"
            color="primary"
            key={1}
            handleClick={() => {
              this.setState({ loading: true });
              this.handleConfirm();
            }}
            disabled={loading}
            isLoading={loading}
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
