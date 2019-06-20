import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const DeleteFeedback = props => {
  const { handleConfirm, handleClose } = props;
  return (
    <React.Fragment>
      <DialogTitle>Delete Feedback</DialogTitle>
      <DialogContent>
        Are you sure, you want to delete your feedback?
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

DeleteFeedback.propTypes = {
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
};

export default DeleteFeedback;
