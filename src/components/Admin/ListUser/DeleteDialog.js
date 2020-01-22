import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../shared/Button';

const DeleteAccount = ({ userEmail, handleConfirm, handleClose }) => {
  const [loading, setLoading] = useState(false);
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
      <DialogActions style={{ justifyContent: 'space-around' }}>
        <Button
          key={1}
          variant="contained"
          color="primary"
          handleClick={() => {
            setLoading(true);
            handleConfirm();
          }}
          isLoading={loading}
          disabled={loading}
          buttonText="Delete"
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
};

DeleteAccount.propTypes = {
  userEmail: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
};

export default DeleteAccount;
