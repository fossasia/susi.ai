import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import OutlinedTextField from '../../shared/OutlinedTextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

const EditFeedback = props => {
  const {
    handleConfirm,
    handleClose,
    feedback,
    errorText,
    handleEditFeedback,
  } = props;
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
            fullWidth={true}
            onChange={handleEditFeedback}
            aria-describedby="edit-feedback-helper-text"
          />
          <FormHelperText id="edit-feedback-helper-text" error>
            {errorText}
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button key={0} style={{ marginRight: 10 }} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          key={1}
          variant="contained"
          color="primary"
          onClick={handleConfirm}
        >
          Edit
        </Button>
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
