import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../../shared/Button';

const ConfirmDialog = props => {
  const { title, content, handleConfirm, handleClose, confirmText } = props;
  return (
    <React.Fragment>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{content}</p>
      </DialogContent>
      {confirmText ? (
        <DialogActions>
          <Button
            key={0}
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            key={1}
            variant="contained"
            color="primary"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            key={1}
            variant="contained"
            color="primary"
            onClick={handleConfirm}
          >
            ok
          </Button>
        </DialogActions>
      )}
    </React.Fragment>
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  handleConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  handleClose: PropTypes.func,
};

export default ConfirmDialog;
