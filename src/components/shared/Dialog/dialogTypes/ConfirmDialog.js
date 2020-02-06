import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../../shared/Button';

const ConfirmDialog = props => {
  const { title, content, handleConfirm, handleClose, confirmText } = props;
  const [loading, setLoading] = useState(false);

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
            color="primary"
            variant="contained"
            handleClick={handleClose}
            buttonText="Cancel"
          />
          <Button
            key={1}
            color="primary"
            variant="contained"
            handleClick={() => {
              setLoading(true);
              handleConfirm();
            }}
            isLoading={loading}
            disabled={loading}
            buttonText={confirmText}
          />
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            key={0}
            color="primary"
            variant="contained"
            handleClick={() => {
              setLoading(true);
              handleConfirm();
            }}
            isLoading={loading}
            disabled={loading}
            buttonText="ok"
          />
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
