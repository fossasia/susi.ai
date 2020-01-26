import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../../shared/Button';

const StandardActionDialog = props => {
  const { handleConfirm, handleClose, entityType, actionType, name } = props;
  const [loading, setLoading] = useState(false);
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
      <DialogActions style={{ justifyContent: 'space-around' }}>
        <Button
          key={1}
          color="primary"
          variant="contained"
          handleClick={handleClose}
          buttonText="Cancel"
        />
        <Button
          key={2}
          color="primary"
          variant="contained"
          handleClick={() => {
            setLoading(true);
            handleConfirm();
          }}
          isLoading={loading}
          disabled={loading}
          buttonText={actionType}
        />
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
