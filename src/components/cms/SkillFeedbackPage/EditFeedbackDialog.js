import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import OutlinedTextField from '../../shared/OutlinedTextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '../../shared/Button';

const EditFeedback = props => {
  const { handleConfirm, handleClose, feedback, handleEditFeedback } = props;

  const [loader, updateLoader] = useState(false);
  const [newFeedback, updateNewFeedback] = useState(feedback);

  const handleEdit = () => {
    updateLoader(true);
    handleConfirm();
  };

  const handelChange = e => {
    updateNewFeedback(e.target.value);
  };

  return (
    <React.Fragment>
      <DialogTitle>Edit Feedback</DialogTitle>
      <DialogContent>
        <FormControl fullWidth={true}>
          <OutlinedTextField
            id="edit-feedback"
            label="Skill Feedback"
            placeholder="Skill Feedback"
            defaultValue={feedback || ''}
            multiLine={true}
            disabled={loader}
            fullWidth={true}
            onChange={e => {
              handleEditFeedback();
              handelChange(e);
            }}
            aria-describedby="edit-feedback-helper-text"
          />
        </FormControl>
      </DialogContent>
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
          handleClick={handleEdit}
          style={{ marginRight: '1em' }}
          disabled={newFeedback.trim().length === 0 || loader}
          isLoading={loader}
          buttonText="Edit"
        />
      </DialogActions>
    </React.Fragment>
  );
};

EditFeedback.propTypes = {
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  handleEditFeedback: PropTypes.func,
  feedback: PropTypes.string,
  errorText: PropTypes.string,
};

export default EditFeedback;
