import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { deleteUserAccount } from '../../../apis/index';

class DeleteUserAccount extends React.Component {
  deleteUser = () => {
    const { userEmail: email } = this.props;
    deleteUserAccount({ email })
      .then(payload => {
        this.setState({ deleteSuccessDialog: true });
      })
      .catch(error => {
        console.log(error);
        this.setState({ deleteFailedDialog: true });
      });
  };

  render() {
    const { userEmail, handleClose } = this.props;
    return (
      <React.Fragment>
        <DialogContent>
          Are you sure you want to delete the account associated with
          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
            {userEmail}
          </span>
          ?
        </DialogContent>
        <DialogActions>
          <Button key={1} color="secondary" onClick={this.deleteUser}>
            Delete
          </Button>
          <Button key={2} color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

DeleteUserAccount.propTypes = {
  keyName: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  skillName: PropTypes.string,
  skillEditStatus: PropTypes.bool,
  skillReviewStatus: PropTypes.bool,
  skillStaffPickStatus: PropTypes.bool,
  systemSkillStatus: PropTypes.bool,
};

export default DeleteUserAccount;
