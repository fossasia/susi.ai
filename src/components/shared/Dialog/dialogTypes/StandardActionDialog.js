import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const StandardActionDialog = props => {
  const { handleConfirm, handleClose, entityType, actionType, name } = props;
  return (
    <React.Fragment>
      <DialogTitle>
        {`${actionType} ${entityType.charAt(0).toUpperCase()}${entityType.slice(
          1,
        )}`}
      </DialogTitle>
      <DialogContent>
        Are you sure, you want to {actionType} your <b>{name}</b> {entityType}?
      </DialogContent>
      <DialogActions>
        <Button key={2} style={{ marginRight: '10px' }} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          key={1}
          variant="contained"
          color="primary"
          onClick={handleConfirm}
        >
          {actionType}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

StandardActionDialog.propTypes = {
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  entityType: PropTypes.string,
  name: PropTypes.string.isRequired,
  actionType: PropTypes.string.isRequired,
};

export default StandardActionDialog;
