import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { DialogTitle } from '@material-ui/core';

const DeleteBot = props => {
  const { type, handleConfirm, handleClose } = props;
  return (
    <React.Fragment>
      <DialogTitle>Delete Modal</DialogTitle>
      <DialogContent style={{ fontSize: '1rem' }}>
        {`Are you sure you want to delete this ${type}?`}
      </DialogContent>
      <DialogActions>
        <Button
          key={2}
          variant="contained"
          color="secondary"
          onClick={handleConfirm}
        >
          Delete
        </Button>
        <Button
          key={1}
          color="primary"
          onClick={handleClose}
          style={{ marginRight: '10px' }}
        >
          Cancel
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

DeleteBot.propTypes = {
  type: PropTypes.string,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
};

export default DeleteBot;
