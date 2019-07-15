import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const DeleteAccount = ({ userEmail, handleConfirm, handleClose }) => {
  return (
    <React.Fragment>
      <DialogTitle>Delete User Account</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the account associated with
        <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
          {userEmail}
        </span>
        ?
      </DialogContent>
      <DialogActions>
        <Button key={1} color="secondary" onClick={handleConfirm}>
          Delete
        </Button>
        <Button key={2} color="primary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

DeleteAccount.propTypes = {
  userEmail: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
};

export default DeleteAccount;
